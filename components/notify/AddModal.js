import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const AddModal = ({ modalShow, setModalShow, AllAccounts, setAllAccounts, updateData, fetchAllAccounts }) => {
  const date = moment(new Date()).utc().format()
  const RefAccountID = useRef()
  const RefNotifyType = useRef()
  const RefEmails = useRef()
  const RefMobiles = useRef()
  const RefNotifyChannels = useRef()
  const RefFireWaitSec = useRef()
  const RefUnfireWaitSec = useRef()
  const RefNotifyWaitSec = useRef()
  const RefCustomSettings = useRef()
  const RefModifyTime = useRef()

  let [formData, setFormData] = useState({
    ID: '',
    AccountID: '',
    NotifyType: '',
    Emails: '',
    Mobiles: '',
    NotifyChannels: '',
    FireWaitSec: '',
    UnfireWaitSec: '',
    NotifyWaitSec: '',
    CustomSettings: '{}',
    ModifyTime: date
  })

  const { darkMode } = useSelector((state) => state.config);


  useEffect(() => {
    if (updateData) {
      const selectedSettings = AllAccounts.find(item => item.ID === updateData.ID)
      setFormData({ ...formData, ...selectedSettings })
    }
  }, [updateData])


  // add new account settings api request
  async function addNewSettings() {
    const data = {
      AccountID: RefAccountID.current.value,
      NotifyType: RefNotifyType.current.value,
      Emails: RefEmails.current.value,
      Mobiles: RefMobiles.current.value,
      NotifyChannels: RefNotifyChannels.current.value,
      FireWaitSec: RefFireWaitSec.current.value,
      UnfireWaitSec: RefUnfireWaitSec.current.value,
      NotifyWaitSec: RefNotifyWaitSec.current.value,
      CustomSettings: RefCustomSettings.current.value,
      ModifyTime: RefModifyTime.current.value
    }
    const dataNotEmpty = Object.values(data).every(value => value !== '')
    if (dataNotEmpty) {
      try {
        const addRequest = await axios.post('/notify/getAS/', data)
        setAllAccounts([...AllAccounts, formData])
        toast.success('Account settings added successfully.')
        fetchAllAccounts()
        setTimeout(() => {
          setModalShow(false)
        }, 300);
        return addRequest.data
      } catch (error) {
        toast.error('something went wrong !')
        console.log(error)
      }
    } else {
      toast.warning('Inputs fields can\'t be empty')
    }
  }

  // update account settings function
  async function updateSettings(id) {
    const selectedSettings = AllAccounts.filter(item => item.ID === id)
    setFormData({ ...formData, selectedSettings })
    const data = {
      ID: id,
      AccountID: RefAccountID.current.value,
      NotifyType: RefNotifyType.current.value,
      Emails: RefEmails.current.value,
      Mobiles: RefMobiles.current.value,
      NotifyChannels: RefNotifyChannels.current.value,
      FireWaitSec: +RefFireWaitSec.current.value,
      UnfireWaitSec: +RefUnfireWaitSec.current.value,
      NotifyWaitSec: +RefNotifyWaitSec.current.value,
      CustomSettings: RefCustomSettings.current.value,
      ModifyTime: RefModifyTime.current.value
    }

    try {
      const addRequest = await axios.put(`/notify/getAS/${id}`, data)
      toast.success('Account settings updated successfully.')
      fetchAllAccounts()
      setTimeout(() => {
        setModalShow(false)
      }, 300);
      setAllAccounts(prev => prev.map(item => item.ID === id ? formData : item))
      return addRequest.data
    } catch (error) {
      toast.error('oops something went wrong! ' + error.message)
    }

  }
  const inputChangeHandler = e => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      className='add_notify_modal'
      centered
    >
      <Modal.Header style={{ background: darkMode ? "#222738" : "#fff" }} closeButton>
        <Modal.Title>{updateData?.ID ? 'Edit account settings' : 'Add new settings'}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: darkMode ? "#151824" : "#fff" }} >
        <Form >
          <Row className='notifyForm-container'>
            <Col md='6'>
              <Form.Group className="mb-3" controlId="AccountID">
                <Form.Label>Account ID</Form.Label>
                <Form.Control
                  defaultValue={updateData?.AccountID || ''}
                  ref={RefAccountID}
                  style={{ borderColor: '#bdbdbd' }}
                  name="AccountID"
                  type="number"
                  placeholder="123"
                  autoFocus
                />
              </Form.Group>
            </Col>
            <Col md='6'>
              <Form.Group className="mb-3" controlId="NotifyType">
                <Form.Label>Notify Type</Form.Label>
                <Form.Control
                  defaultValue={updateData?.NotifyType || ''}
                  ref={RefNotifyType}
                  style={{ borderColor: '#bdbdbd' }}
                  name="NotifyType"
                  type="text"
                  placeholder="Write notify type..."
                />
              </Form.Group>
            </Col>
            <Col md='12'>
              <Form.Group className="mb-3" controlId="Emails">
                <Form.Label>Emails</Form.Label>
                <Form.Control
                  defaultValue={updateData?.Emails || ''}
                  ref={RefEmails}
                  style={{ borderColor: '#bdbdbd' }}
                  name="Emails"
                  type="text"
                  placeholder="name@example.com"
                />
              </Form.Group>
            </Col>
            <Col md='12'>
              <Form.Group className="mb-3" controlId="Mobiles">
                <Form.Label>Mobile Numbers</Form.Label>
                <Form.Control
                  defaultValue={updateData?.Mobiles || ''}
                  ref={RefMobiles}
                  style={{ borderColor: '#bdbdbd' }}
                  name="Mobiles"
                  type="number"
                  placeholder="0512345678"
                />
              </Form.Group>
            </Col>
            <Col md='12'>
              <Form.Group className="mb-3" controlId="NotifyChannels">
                <Form.Label>Notify Channels</Form.Label>
                <Form.Control
                  defaultValue={updateData?.NotifyChannels || ''}
                  ref={RefNotifyChannels}
                  style={{ borderColor: '#bdbdbd' }}
                  name="NotifyChannels"
                  type="text"
                  placeholder="Write notify channels..."
                />
              </Form.Group>
            </Col>
            <Col md='4'>
              <Form.Group className="mb-3" controlId="FireWaitSec">
                <Form.Label>Fire Wait Seconds</Form.Label>
                <Form.Control
                  defaultValue={updateData?.FireWaitSec || ''}
                  ref={RefFireWaitSec}
                  style={{ borderColor: '#bdbdbd' }}
                  name="FireWaitSec"
                  type="number"
                  placeholder="300"
                  onKeyDown={inputChangeHandler}
                  min="0"

                />
              </Form.Group>
            </Col>
            <Col md='4'>
              <Form.Group className="mb-3" controlId="UnfireWaitSec">
                <Form.Label>Unfire Wait Seconds</Form.Label>
                <Form.Control
                  defaultValue={updateData?.UnfireWaitSec || ''}
                  ref={RefUnfireWaitSec}
                  style={{ borderColor: '#bdbdbd' }}
                  name="UnfireWaitSec"
                  type="number"
                  placeholder="300"
                  onKeyDown={inputChangeHandler}
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md='4'>
              <Form.Group className="mb-3" controlId="NotifyWaitSec">
                <Form.Label>Notify Wait Seconds</Form.Label>
                <Form.Control
                  defaultValue={updateData?.NotifyWaitSec || ''}
                  ref={RefNotifyWaitSec}
                  style={{ borderColor: '#bdbdbd' }}
                  name="NotifyWaitSec"
                  type="number"
                  placeholder="300"
                  onKeyDown={inputChangeHandler}
                  min="0"

                />
              </Form.Group>
            </Col>
            <Col md='12'>
              <Form.Group className="mb-3" controlId="CustomSettings">
                <Form.Label>Custom Settings</Form.Label>
                <Form.Control
                  defaultValue={updateData?.CustomSettings}
                  ref={RefCustomSettings}
                  style={{ borderColor: '#bdbdbd' }}
                  name="CustomSettings"
                  type="text"
                  placeholder="Write custom settings..."
                />
                <Form.Control
                  hidden
                  defaultValue={updateData?.ModifyTime}
                  ref={RefModifyTime}
                  value={moment(new Date).utc().format()}
                  style={{ borderColor: '#bdbdbd' }}
                  name="CustomSettings"
                  type="text"
                  placeholder="Write custom settings..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ background: darkMode ? "#151824" : "#fff" }}>
        <Button variant="secondary" className='py-2 px-3' onClick={() => setModalShow(false)}>
          Close
        </Button>
        <Button variant={updateData?.ID ? "success" : "primary"} className='py-2 px-3' onClick={() => {
          if (updateData?.ID) {
            updateSettings(updateData?.ID)
          } else {
            addNewSettings()
          }
        }}>
          {updateData?.ID ? 'Save Changes' : 'Add new settings'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddModal