import React from 'react'

import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  CameraRoll,
  TouchableHighlight,
  Platform,
  Alert
} from 'react-native'

import RNFetchBlob from 'react-native-fetch-blob'

const NUMBER_OF_COlUMNS = 2
const { width, height } = Dimensions.get('window');
const equalWidth = (width / NUMBER_OF_COlUMNS)

class ImageBrowser extends React.Component {
  static navigationOptions = {
    title: 'Mobiliya Assignment',
  }

  state = {
    images: [],
    loading: true,
  }

  componentDidMount() {
    this.fetchPhotos()
  }
  
  fetchPhotos = async () => {
    this.setState({ loading: true })
    try {
            res  = await fetch('https://www.flickr.com/services/feeds/photos_public.gne?tags=%27%27&format=json&jsoncallback=?');
            data = await res.text();
            console.log(data);
            data = data.replace('(', '');
            data = data.replace('})', '}');
            data = JSON.parse(data);
            this.state.images.push(...data.items)
            this.setState({ images: this.state.images, loading: false})
        } catch (error) {
            console.log('-------'+error)
        }
  }

  saveToCameraRoll = (item) => {
    if (Platform.OS === 'android') {
      RNFetchBlob
      .config({
        fileCache : true,
        appendExt : 'jpg'
      })
      .fetch('GET', item.media.m)
      .then((res) => {
        CameraRoll.saveToCameraRoll(res.path())
          .then(Alert.alert('Success', 'Photo added to camera roll!'))
          .catch(err => console.log('err:', err))
      })
    } else {
      CameraRoll.saveToCameraRoll(item.media.m)
        .then(Alert.alert('Success', 'Photo added to camera roll!'))
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {
          this.state.loading ? (
            <Text style={{ padding: 10, textAlign: 'center' }}>Loading...</Text>
          ) : (
            <Button
              onPress={this.fetchPhotos}
              title='View More'
            />
          )
        }
       <ScrollView contentContainerStyle={styles.scrollContainer}>
          {
            this.state.images.map((image, i) => {
              return (
                <TouchableHighlight
                  key={i}
                  onPress={() => this.saveToCameraRoll(image)}
                  underlayColor='transparent'
                >
                  <Image
                    style={styles.image}
                    source={{ uri: image.media.m }}
                  />
                </TouchableHighlight>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  centerLoader: {
    height: height - 100,
    width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: width / 2, height: width / 2
  },
  title: {
    textAlign: 'center',
    padding: 20
  }
})

export default ImageBrowser
