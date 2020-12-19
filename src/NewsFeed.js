import React from 'react';
import {Row,Container,Col,ProgressBar, Card, Image,ToggleButtonGroup,ToggleButton} from 'react-bootstrap';
import NewsComponent from "./NewsComponent.js"
// import { useState, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';



import ReactPaginate from 'react-paginate';

let perPage=10;

class NewsFeed extends React.Component{
  constructor(props) {
    super(props);
     this.state = {
        count: 0,
        pageCount:0,
        data:[],
        originalData:[],
        range:50
     };

     this.getNewsPosts=this.getNewsPosts.bind(this);
     this.handlePageClick=this.handlePageClick.bind(this);
     this.filterByCategory=this.filterByCategory.bind(this);
     this.filterByRange=this.filterByRange.bind(this);
  }

  componentDidMount(){
      
    this.getNewsPosts();
  }



  getNewsPosts(){
    fetch('https://us-central1-trans-campus-298823.cloudfunctions.net/search').then(res => res.json()).then(data => {

    let len=data.length;
    for(var i=0; i< len;i++){
    if(data[i].sentiment.sentiment.score>0){
        data[i].emotion="smile"
    }else if(data[i].sentiment.sentiment.score==0){
        data[i].emotion="think"
    }else if(data[i].sentiment.sentiment.score<0){
        data[i].emotion="sad"
    }
    }

    this.setState({
        data: data,
        originalData: data,
        pageCount: Math.ceil(len/perPage)
    });
    return data;
  });
}



filterByCategory(category){
        var newData=[];
        var cat=category[category[3]]
        for(var i in this.state.originalData){
            if(this.state.originalData[i].emotion==cat){
                newData.push(this.state.originalData[i]);
            }
        }
        var len=newData.length
        this.setState({
            data: newData,
            pageCount: Math.ceil(len/perPage)
         }
        )
        
}



  handlePageClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    this.setState({ offset: offset }, () => {
      this.getNewsPosts();
    });
  };

  filterByRange(range){
    var newData=[];
    this.state.range=range;
    for(var i in this.state.originalData){
        if(this.state.originalData[i].sentiment.trust_score>=parseInt(range)){
            newData.push(this.state.originalData[i]);
        }
    }
    var len=newData.length
    this.setState({
        data: newData,
        pageCount: Math.ceil(len/perPage)
     }
    )

  };

    

  render(){
      let newsNodes = this.state.data.map(function (news, index) {

        return (
            <NewsComponent key={news._id.$oid} title={news.title} url={news.url} sentiment={news.emotion} trust_score={news.sentiment.trust_score.toFixed(2)}></NewsComponent>

        );
    });
    var value=["smile","think","sad"]
    var fallacyValue=this.state.range;

  return(
    
      <Container style={{marginTop:"10px"}}>
          <Row className="togglers margin-setter">
          <Col md={10} xs={10} style={{textAlign:"right"}} >How do I feel today?
            </Col>
            <Col>
          <ToggleButtonGroup type="checkbox" value={value} onChange={this.filterByCategory}>
            <ToggleButton value={0} className="toggle-button-smile" ></ToggleButton>
            <ToggleButton value={1} className="toggle-button-think"></ToggleButton>
            <ToggleButton value={2} className="toggle-button-sad"></ToggleButton>
           </ToggleButtonGroup>
           </Col>

           </Row>
           <Row className="margin-setter">
            <Col md={10} xs={10} style={{textAlign:"right"}}>Turn me up to reduce Fake News
            </Col>
            <Col>
           <RangeSlider className="range-selector"
                value={fallacyValue}
                onChange={changeEvent => this.filterByRange(changeEvent.target.value)}
                tooltipLabel={currentValue => `${currentValue}%`}
                tooltip='on'
                variant='success'
                />
            </Col>

           </Row>
           <Row style={{marginTop:"2em"}} className="newsfeed-decor">
          {newsNodes}
          </Row>
          
      </Container>
  )

}

}

export default NewsFeed;