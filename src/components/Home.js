import React from 'react';
import { Tabs, Button, Spin} from 'antd';
import {GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY} from "../constants"
import {Gallery} from "./Gallery"


const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        error: '',
        isLoadingPosts: false,
        posts: []
    }
    componentDidMount(){
        if('geolocation' in navigator) {
            this.setState({isLoadingGeoLocation: true});
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailLoadGeoLocation,
                GEO_OPTIONS
            );
        }else{
            this.setState({error: 'GeoLocation is not supported'});
        }
    }
    onSuccessLoadGeoLocation =(position) => {
        console.log(position);
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lan: longitude}));

        this.setState({isLoadingGeoLocation: false});
        this.loadNearbyPost();
    }
    onFailLoadGeoLocation =() => {
        console.log("fail load geo location");
        this.setState({isLoadingGeoLocation: false, error: 'Failed to load geo Location'});
    }
    loadNearbyPost = () => {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to load posts.');
        }).then((data) => {
            console.log(data);
            this.setState({isLoadingPosts: false, posts: data ? data : []});
        }).catch((e) => {
            console.log(e.message);
            this.setState({isLoadingPosts: false, error: e.message});
        });
    }

    getImagePost = () => {
        const{error, isLoadGeoLocation, isLoadingPosts, posts }= this.state;
        if (this.state.error) {
            return <div> {this.state.error}</div>
        }else if (isLoadGeoLocation){
            return <Spin tip="Loading geoLocation"/>
        }else if(isLoadingPosts){
            return <Spin tip="Loading posts"/>
        }else if(posts.length > 0){
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    srcset: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300
                }
            })
            return (<Gallery images={images}/>)
        }else{
            return 'No nearby posts';
        }
    }
    render() {
        const operations = <Button type="primary">Create New post</Button>;
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Post" key="1">
                    {/*{this.state.isLoadingGeoLocation ? 'Loading geo location...' : 'Contetent 1'}*/}
                    {this.getImagePost()}
                </TabPane>
                <TabPane tab="Video Post" key="2">Content of tab 2</TabPane>
                <TabPane tab="Map" key="3">Content of tab 3</TabPane>
            </Tabs>
        );
    }
}
