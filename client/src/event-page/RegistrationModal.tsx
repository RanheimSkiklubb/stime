import React, {useState, ChangeEvent, FormEvent} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Event from '../model/event';
import Club from '../model/club';


interface Props {
    event: Event,
    clubs: Club[],
    loadEventCallback: () => void
}

const RegistrationForm: React.FC<Props> = (props: Props) => {

    const [validated, setValidated] = useState(false);
    const [progress, setProgress] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState(props.clubs[0].name);
    const [eventClass, setEventClass] = useState("Mini");

    const firstNameChange = (event:ChangeEvent<HTMLInputElement>) => setFirstName(event.currentTarget.value);
    const lastNameChange = (event:ChangeEvent<HTMLInputElement>) => setLastName(event.currentTarget.value);
    const clubChange = (event:ChangeEvent<HTMLInputElement>) => setClub(event.currentTarget.value);
    const eventClassChange = (event:ChangeEvent<HTMLInputElement>) => setEventClass(event.currentTarget.value);

    const handleEdit = () => {
        setProgress(0);
    }

    const handleRegister = async () => {
        try {
            await fetch(`http://localhost:3001/api/event/1/participant`, 
            {
                method: 'POST', 
                body: JSON.stringify({firstName, lastName, club, eventClass}),
                headers: {'Content-Type': 'application/json'}
            });
            props.loadEventCallback();
            setProgress(2);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleRegisterMore = () => {
        setFirstName("");
        setProgress(0);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setProgress(1);
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
                    {props.clubs.map(c => (<option key={c.name}>{c.name}</option>))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicEventClass">
                <Form.Label>Velg klasse</Form.Label>
                <Form.Control as="select" onChange={eventClassChange} value={eventClass}>
                    {props.event.eventClasses.map(eventClass => (<option value={eventClass.name} key={eventClass.name}>{`${eventClass.name} (${eventClass.course})`}</option>))}
                </Form.Control>
            </Form.Group>
            <Button className="float-right" variant="outline-primary" type="submit">Neste</Button>
        </Form>
    );

    const step1 = (
        <div>
            <p>Du har registert følgende</p>
            <Table bordered size="sm">
                <tbody>
                    <tr>
                        <td>Fornavn</td>
                        <td>{firstName}</td>
                    </tr>
                    <tr>
                        <td>Etternavn</td>
                        <td>{lastName}</td>
                    </tr>
                    <tr>
                        <td>Klubb</td>
                        <td>{club}</td>
                    </tr>
                    <tr>
                        <td>Klasse</td>
                        <td>{eventClass}</td>
                    </tr>
                </tbody>
            </Table>
            <Button variant="outline-primary" onClick={handleEdit}>Endre</Button>
            <Button variant="outline-primary" className="float-right" onClick={handleRegister}>Meld på</Button>
        </div>
    );

    const step2 = (
        <div>
            <p>Din påmelding er registrert!</p>
            <Button variant="outline-primary" className="float-right" onClick={handleRegisterMore}>Meld på flere</Button>
        </div>
    );

    if (progress === 0) {
        return form
    }
    if (progress === 1) {
        return step1;
    }
    return step2;
    
}


const RegistrationModal: React.FC<Props> = (props: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    

    return (  
        <>
            <Button variant="outline-primary" onClick={handleShow}>Meld på</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Påmelding</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrationForm event={props.event} clubs={props.clubs} loadEventCallback={props.loadEventCallback}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>Lukk</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RegistrationModal;