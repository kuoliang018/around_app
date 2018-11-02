import React from 'react';
import { Tabs, Button } from 'antd';
import { GEO_OPTIONS} from "../constants"

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    componentDidMount(){
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailLoadGeoLocation,
                GEO_OPTIONS
            );
        }else{

        }
    }
    onSuccessLoadGeoLocation =(position) => {
        console.log(position);

    }
    onFailLoadGeoLocation =() => {
        console.log("fail load geo location");
    }
    render() {
        const operations = <Button type="primary">Create New post</Button>;
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Post" key="1">Content of tab 1</TabPane>
                <TabPane tab="Video Post" key="2">Content of tab 2</TabPane>
                <TabPane tab="Map" key="3">Content of tab 3</TabPane>
            </Tabs>
        );
    }
}
