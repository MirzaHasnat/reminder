import React,{useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Popover, Form, Radio, DatePicker} from 'antd';
import moment from 'moment';

function App() {

  let now = new Date();
  let [radioDate,setRadioDate] = useState('');
  let [pickDate,setPickDate] = useState(moment(now));

  let onRadioChange = (targetValue) => {

    let today = new Date()
    setRadioDate(targetValue.target.value);
    setPickDate(moment(today).add(targetValue.target.value,'days'));

  }

  let submit = () => {
    fetch('http://localhost:5000/remind',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        date:pickDate.format('YYYY-MM-DD'),
        email:"hasnatmirza111@gmail.com"
      })
    }).then(_=>{
      fetch('http://localhost:5000/remind/remind',{
        method:'GET'
      });
    });
  }


  return (
    <div className="App">
      <Popover content={
        <>
          <Form.Item>
            <Radio.Group buttonStyle="outlined" value={radioDate} onChange={e=>{onRadioChange(e);}}>
              <Radio.Button value="1">1 Day</Radio.Button>
              <Radio.Button value="3">3 Days</Radio.Button>
              <Radio.Button value="7">1 Week</Radio.Button>
              <Radio.Button value="30">1 Month</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <DatePicker defaultValue={pickDate} onChange={(e)=>{setPickDate(e.target.value);}} value={pickDate} style={{width:"100%"}} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={()=>{submit();}}>Remind!</Button>
          </Form.Item>
        </>

      } title="Set Reminder">
        <Button type="primary">Reminder</Button>
      </Popover>
    </div>
  );
}

export default App;
