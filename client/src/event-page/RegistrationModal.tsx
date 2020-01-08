import React, {useState, ChangeEvent, FormEvent} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Participant from '../Participant';


const RegistrationForm: React.FC = () => {

    const [validated, setValidated] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState("");
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
                registered.push(new Participant(registrationCount.toString(), firstName, lastName, club, eventClass));
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
                <Form.Control type="text" required placeholder="Skriv inn klubbnavn" onChange={clubChange} value={club}/>
            </Form.Group>
            <Form.Group controlId="formBasicEventClass">
                <Form.Label>Velg klasse</Form.Label>
                <Form.Control as="select" onChange={eventClassChange} value={eventClass}>
                    <option>Mini</option>
                    <option>J 08-10</option>
                    <option>J 10-11</option>
                    <option>J 12-13</option>
                    <option>J 14-15</option>
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

const RegistrationModal: React.FC = () => {
    const [show, setShow] = useState(false);
    //const [showForm, setShowForm] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    
    console.log("Render")

    //const handleFinishedChange = (finished:boolean) => setShowForm(finished);

    return (
        
        <>
            <Button variant="outline-primary" onClick={handleShow}>Meld på</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Påmelding</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrationForm/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Lukk</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RegistrationModal;