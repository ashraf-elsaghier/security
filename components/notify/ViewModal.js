import React from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const ViewModal = ({show, setShow, data}) => {
  const { darkMode } = useSelector((state) => state.config);


  return (
    <Modal 
      show={show} 
      onHide={() => setShow(false)}
      className='add_notify_modal' 
      centered
    >
        <Modal.Header style={{background: darkMode ? "#222738" : "#fff" }}  closeButton>
          <Modal.Title className='text-center mx-auto'>View Details for account ID <span className="text-primary">{data?.AccountID}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{background: darkMode ? "#151824" : "#fff" }}>
          <Row>
            <Col className='border-2 border-bottom p-2' md={4}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">ID:</span>
                <span > {data?.ID || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={4}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Account ID:</span>
                <span > {data?.AccountID || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={4}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Notify Type:</span>
                <span > {data?.NotifyType || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={12}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Emails:</span>
                <span > {data?.Emails?.split(',').join(', ') || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={6}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Mobiles:</span>
                <span > {data?.Mobiles || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={6}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Notify Channels:</span>
                <span > {data?.NotifyChannels || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={4}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Fire Wait Seconds:</span>
                <span > {data?.FireWaitSec || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={4}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Unfire Wait Seconds:</span>
                <span > {data?.UnfireWaitSec || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={4}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Notify Wait Seconds:</span>
                <span > {data?.NotifyWaitSec || 'Not Found'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={12}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Custom Settings:</span>
                <span > {data?.CustomSettings || '{}'}</span>
              </div>
            </Col>
            <Col className='border-2 border-bottom p-2' md={12}> 
              <div className=" text-secondary my-1">
                <span className="fw-bold text-primary">Modify Time:</span>
                <span > {data?.ModifyTime || '{}'}</span>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer style={{background: darkMode ? "#151824" : "#fff" }}>
        <Button variant="secondary" className='py-2 px-3' onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
        </Modal>
  )
}
  /*





*/
export default ViewModal