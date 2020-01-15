import React from 'react';
import './EventPage.css';
import Event from '../model/event';
import Table from 'react-bootstrap/Table';
import EventClass from '../model/eventClass';
import Form from 'react-bootstrap/Form';

interface Props {
    event: Event;
}

const StartNumberTab: React.FC<Props> = (props: Props) => {

    return (
        <div className="marginTop15">
            <Table bordered className="startNumberAdminTable">
                <thead>
                    <tr>
                        <th>Klasse</th>
                        <th>Startmetode</th>
                        <th>Intervall</th>
                        <th>Ant. reservenummer</th>
                    </tr>
                </thead>
                <tbody>
                    {props.event.eventClasses.map((ec:EventClass, idx:number) => 
                    <tr key={idx}>
                        <td>{`${ec.name} (${ec.course})`}</td>
                        <td>
                            <Form>
                                <Form.Check label="intervallstart" type="radio" name={`start-method-${idx}`} />
                                <Form.Check label="fellesstart" type="radio" name={`start-method-${idx}`} />
                            </Form>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    );
    
}

export default StartNumberTab;