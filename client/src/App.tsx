import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

const Content: React.FC = () => {
    return (
        <div>
            <h1>Arrangement</h1><br/>
            <ListGroup>
                <ListGroup.Item action href="#link1">Telenorkarusellen 2020: Renn 1</ListGroup.Item>
                <ListGroup.Item action href="#link2">Telenorkarusellen 2020: Renn 2</ListGroup.Item>
                <ListGroup.Item action href="#link3">Telenorkarusellen 2020: Renn 3</ListGroup.Item>
            </ListGroup>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <Container fluid={true}>
            <Row>
                <Col></Col>
                <Col className="text-center" style={{"border": "solid 1px"}} xs={9}><Content/></Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default App;
