import React, {useState, ChangeEvent, FormEvent} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Participant from '../Participant';
import Event from '../Event';
import Club from '../model/club';


interface Props {
    event: Event,
    clubs: Club[]
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [validated, setValidated] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState(props.clubs[0].name);
    const [eventClass, setEventClass] = useState("Mini");
    const [registered] = useState<Participant[]>([]);
    let registrationCount = 0;

    const firstNameChange = (event:ChangeEvent<HTMLInputElement>) => setFirstName(event.currentTarget.value);
    const lastNameChange = (event:ChangeEvent<HTMLInputElement>) => setLastName(event.currentTarget.value);
    const clubChange = (event:ChangeEvent<HTMLInputElement>) => setClub(event.currentTarget.value);
    const eventClassChange = (event:ChangeEvent<HTMLInputElement>) => setEventClass(event.currentTarget.value);

    const handleRegisterMore = () => {
        setFirstName("");
        setShowForm(true);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit");
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            try {
                await fetch(`http://localhost:3000/api/event/1/participant`, 
                {
                    method: 'POST', 
                    body: JSON.stringify({firstName, lastName, club, eventClass}),
                    headers: {'Content-Type': 'application/json'}
                });
                registered.push({id: registrationCount.toString(), firstName, lastName, club, eventClass});
                registrationCount += 1;
                setShowForm(false);
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            setValidated(true); //Trigger display of validation responses in form
        }
    };

    const form = (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicFirstName">
                <Form.Label>Fornavn</Form.Label>
                <Form.Control type="text" required placeholder="Skriv inn for- og mellomnavn" onChange={firstNameChange} value={firstName}/>
            </Form.Group>
            <Form.Group controlId="formBasicLastName">
                <Form.Label>Etternavn</Form.Label>
                <Form.Control type="text" required placeholder="Skriv inn etternavn" onChange={lastNameChange} value={lastName}/>
            </Form.Group>
            <Form.Group controlId="formBasicClub">
                <Form.Label>Klubb</Form.Label>
                <Form.Control as="select" onChange={clubChange} value={club}>
                    {props.clubs.map(c => (<option>{c.name}</option>))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicEventClass">
                <Form.Label>Velg klasse</Form.Label>
                <Form.Control as="select" onChange={eventClassChange} value={eventClass}>
                    {props.event.eventClasses.map(eventClass => (<option value={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</option>))}
                </Form.Control>
            </Form.Group>
            <Button variant="outline-primary" type="submit">Meld på</Button>
        </Form>
    );

    if (showForm) {
        return form
    } 
    return (
        <div>
            Din påmelding er registrert
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Fornavn</th>
                        <th>Etternavn</th>
                        <th>Klubb</th>
                        <th>Klasse</th>
                    </tr>
                </thead>
                <tbody>
                    {registered.map(p => <tr key={p.id}>
                        <td>{p.firstName}</td>
                        <td>{p.lastName}</td>
                        <td>{p.club}</td>
                        <td>{p.eventClass}</td>
                    </tr>)}
                    
                </tbody>
            </Table>
            <Button variant="outline-primary" onClick={handleRegisterMore}>Meld på flere</Button>
        </div>
    )
    
}


const RegistrationModal: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    
    console.log("Render")

    return (
        
        <>
            <Button variant="outline-primary" onClick={handleShow}>Meld på</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Påmelding</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrationForm event={props.event} clubs={props.clubs}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Lukk</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RegistrationModal;