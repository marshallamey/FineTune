import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap'
import AttrSlider from '../AttrSlider'

import Switch from 'react-switch'
import { FaPlay, FaGuitar, FaRobot, FaSadCry, FaTimes } from 'react-icons/fa'
import { GiPartyPopper } from "react-icons/gi";
import { BiHappyHeartEyes } from "react-icons/bi";
import { CgSmileMouthOpen, CgSmileNoMouth } from "react-icons/cg";
const FilterControls = props => {
  const handleChange = (newValue, num) => {
    return 0
    // this.setState({['value'+num]: newValue});
  }
  return (
    <Container className='filter-controls'>
      <Row className='filter-controls__switches'>
        <Col className='filter-controls__switches--words'>
          <ButtonGroup>
            <Button><CgSmileMouthOpen /></Button>
            <Button>All</Button>
            <Button><CgSmileNoMouth /></Button>
          </ButtonGroup>
          {/* <Switch
            className='filter-controls__switch'
            onColor='#00aa00'
            offColor='#880000'
            onChange={handleChange}
            checked={true}
            checkedIcon={<CgSmileMouthOpen />}
            uncheckedIcon={<CgSmileNoMouth />}
          /> */}
          <span className='filter-controls__switch--label' >Words</span>
        </Col>
        <Col className='filter-controls__switches--mood'>
        <ButtonGroup>
            <Button><BiHappyHeartEyes /></Button>
            <Button>All</Button>
            <Button><FaSadCry /></Button>
          </ButtonGroup>
          {/* <Switch
            className='filter-controls__switch'
            onChange={handleChange}
            checked='checked'
            checkedIcon={}
            uncheckedIcon={<FaSadCry />}
          /> */}
          <span className='filter-controls__switch--label' >Mood</span>
        </Col>
        <Col className='filter-controls__switches--popularity'>
          <Switch
            className='filter-controls__switch'
            onChange={handleChange}
            checked='checked'
            checkedIcon={<GiPartyPopper />}
            uncheckedIcon={<FaTimes />}
          />
          <span className='filter-controls__switch--label' >Popular</span>
        </Col>
        <Col className='filter-controls__switches--acoustic'>
          <Switch
            className='filter-controls__switch'
            onChange={handleChange}
            checked='checked'
            checkedIcon={<FaGuitar />}
            uncheckedIcon={<FaRobot />}
          />
          <span className='filter-controls__switch--label' >Acoustic</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <AttrSlider name='signature' id='sig' min={1} max={13} step={1} />
        </Col>
        <Col>
          <AttrSlider name='key' id='key' min={0} max={11} step={1} />
        </Col>
      </Row>
      <Row>
        <Col>
          <AttrSlider name='signature' id='sig' min={1} max={13} step={1} />
        </Col>
        <Col>
          <AttrSlider name='key' id='key' min={0} max={11} step={1} />
        </Col>
      </Row>
    </Container>
  )
}

export default withRouter(FilterControls)
