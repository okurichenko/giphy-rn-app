import React, { PureComponent } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, FlatList, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
import API from '../Services/Api';
import SearchBar from '../Components/SearchBar';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/GifScreenStyle'

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
      gifs: [...this.state.gifs, ...gifs.data.data],
      refreshing: false,
    });
  }

  searchGifs = async () => {
    const api = API.create();
    const { query, offset } = this.state;
    const gifs = await api.searchGifs(query, offset);
    let newGifs = gifs.data.data;
    if (offset !== 20) {
      newGifs = [...this.state.gifs, ...newGifs]
    }
    this.setState({
      ...this.state,
      offset: offset + 20,
      gifs: newGifs,
      refreshing: false,
    });
  }

  getGifs = () => {
    if (!this.state.refreshing) {
      this.setState({
        ...this.state,
        refreshing: true,
      })
      const { query } = this.state
      if (query) {
        return this.searchGifs();
      }
      return this.getTrendingGifs();
    }
  }

  handleSearchCancel = () => {
    this.setState({
      ...this.state,
      query: '',
      offset: 0,
      gifs: [],
    });

    this.getGifs();
  }

  handleOnUpdate = (query) => {
    console.log(query);
    this.setState({
      ...this.state,
      query
    })
  }

  _keyExtractor = (item, index) => `${item.id}${(new Date()).getTime()}`;

  render () {
    return (
      <View style={styles.container}>
        <SearchBar
          searchTerm={this.state.query}
          onSearch={this.getGifs}
          onCancel={this.handleSearchCancel}
          onUpdateSearchTerm={this.handleOnUpdate}
        />
        <ScrollView>
          <FlatList
            style={{flex: 1, minHeight: 40}}
            data={this.state.gifs}
            refreshing={this.state.refreshing}
            onEndReached={this.getGifs}
            onEndReachedThreshold={0.4}
            keyExtractor={this._keyExtractor}
            renderItem={({item}) => <Image style={{width: 320, height: 100}} source={{uri: item.images.fixed_width_still.url}} />}
          />
        </ScrollView>
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
