import React from 'react';
import {Row,Container,Col,ProgressBar, Card, Image} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faSmileBeam} from '@fortawesome/free-solid-svg-icons';
import smile from "./smileColor.svg";
import sad from "./sadColor.svg";
import think from "./thinkingColor.svg";


class NewsComponent extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
          title: props.title,
          url: props.url,
          sentiment:props.sentiment,
          trust_score:props.trust_score
        };
      }

    render(){

    let sadClass="";
    let thinkClass="";
    let smileClass="";

    if(this.state.sentiment!="sad"){
        sadClass="set-opaciy"
    }
    if(this.state.sentiment!="think"){
        thinkClass="set-opaciy"
    }
    if(this.state.sentiment!="smile"){
        smileClass="set-opaciy"
    }

    let colorClass="success";
    if(this.state.trust_score>=40 && this.state.trust_score<=80){
        colorClass="warning";
    }
    if(this.state.trust_score<40 ){
        colorClass="danger";
    }

    return(
    <Container>
        <Card className="set-margin" >
            <Card.Body className="adding-hoover">
                <Card.Title className="news-header">
                    <Row>
                    <Col xs={10} md={10}><a className="link-style" href={this.state.url}>{this.state.title}</a></Col>
                    <Col>
                    <Row style={{paddingBottom: "0.5em"}}>
                        <ProgressBar now={this.state.trust_score} label={`${this.state.trust_score}%`} className="set-width" variant={colorClass} ></ProgressBar>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <Image src={smile} className={'emoji-decoraions ' + smileClass}></Image>
                        <Image src={think} className={'emoji-decoraions ' + thinkClass}></Image>
                        <Image src={sad} className={'emoji-decoraions ' + sadClass} ></Image>
                    </Row>
                    </Col>
                    </Row>
                    </Card.Title>
            </Card.Body>
        </Card>
        <hr className="hr-class"></hr>
    </Container>

    );
    }   

}

export default NewsComponent;