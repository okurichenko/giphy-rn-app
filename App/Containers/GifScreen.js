import React, { PureComponent } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, FlatList, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
import API from '../Services/Api';
import SearchBar from '../Components/SearchBar';
import Metrics from '../Themes/Metrics';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/GifScreenStyle'

class RowImage extends PureComponent {
  render() {
    const {url, height}= this.props;
    return <Image
      style={{width: Metrics.screenWidth, height: (Metrics.screenWidth/200*height), marginVertical: 25}}
      source={{uri: url}} />
  }
}

const configView = {
  minimumViewTime: 2000,
  itemVisiblePercentThreshold: 100,
  waitForInteraction: true,
};

class GifScreen extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      query: '',
      offset: 0,
      gifs: [],
    };

    // this.getGifs();
  }



  getTrendingGifs = async () => {
    const api = API.create();
    const gifs = await api.getTrending(this.state.offset);
    this.setState({
      ...this.state,
      offset: this.state.offset + 20,
      gifs: [...this.state.gifs, ...gifs.data.data.map(gif => ({...gif, is_visible: false}))],
    });
  }

  searchGifs = async () => {
    const api = API.create();
    const { query, offset } = this.state;
    const gifs = await api.searchGifs(query, offset);
    let newGifs = gifs.data.data.map(gif => ({...gif, is_visible: false}));
    if (offset !== 20) {
      newGifs = [...this.state.gifs, ...newGifs]
    }
    this.setState({
      ...this.state,
      offset: offset + 20,
      gifs: newGifs,
    });
  }

  getGifs = () => {
    const { query } = this.state
    if (query) {
      return this.searchGifs();
    }
    return this.getTrendingGifs();
  }

  handleSearchCancel = () => {
    this.setState({
      ...this.state,
      query: '',
      offset: 0,
      gifs: [],
    });
  }

  handleOnUpdate = (query) => {
    this.setState({
      ...this.state,
      query
    })
  }

  renderItem = ({item}) => {
    let url = item.is_visible ? item.images.fixed_width.url : item.images.fixed_width_still.url;
    const height = item.images.fixed_width.height;

    return <RowImage url={url} height={height}/>
    // return (
    //   <Image style={{width: Metrics.screenWidth, height: (Metrics.screenWidth/200*item.images.fixed_width.height), marginVertical: 25}} source={{uri: item.images.fixed_width_still.url}} />
    // );
  }

  handleViewableItemsChanged = ({changed}) => {
    const changedKeys = changed.map((ci) => ci.key);
    const gifs = [...this.state.gifs];

    console.log('handleViewableItemsChanged', changed, changedKeys);
    changed.forEach((changedItem) => {
      gifs.splice(changedItem.index, 1, {
        ...changedItem.item,
        is_visible: changedItem.isViewable,
      });
    });

    this.setState({
      ...this.state,
      gifs,
    })
  }

  _keyExtractor = (item, index) => `${item.id}`;

  render () {
    return (
      <View style={styles.container}>
        <SearchBar
          searchTerm={this.state.query}
          onSearch={this.getGifs}
          onCancel={this.handleSearchCancel}
          onUpdateSearchTerm={this.handleOnUpdate}
        />
        <FlatList
          style={{flex: 1}}
          data={this.state.gifs}
          onEndReached={this.getGifs}
          onEndReachedThreshold={0.2}
          keyExtractor={this._keyExtractor}
          viewableConfig={configView}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GifScreen)
