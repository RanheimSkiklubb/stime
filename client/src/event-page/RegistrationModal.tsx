import React, {useState, ChangeEvent, FormEvent} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface State {
    show: string,
    firstName: string,
    lastName: string,
    club: string,
    eventClass: string
}

const RegistrationModal: React.FC = () => {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [club, setClub] = useState("");
    const [eventClass, setEventClass] = useState("Mini");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const firstNameChange = (event:ChangeEvent<HTMLInputElement>) => setFirstName(event.currentTarget.value);
    const lastNameChange = (event:ChangeEvent<HTMLInputElement>) => setLastName(event.currentTarget.value);
    const clubChange = (event:ChangeEvent<HTMLInputElement>) => setClub(event.currentTarget.value);
    const eventClassChange = (event:ChangeEvent<HTMLInputElement>) => setEventClass(event.currentTarget.value);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit");
        const form = event.currentTarget;
        setValidated(true); //Trigger display of validation responses in form
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            let postResponse;
            try {
                postResponse = await fetch(`http://localhost:3000/api/event/1/participant`, 
                {
                    method: 'POST', 
                    body: JSON.stringify({firstName, lastName, club, eventClass}),
                    headers: {'Content-Type': 'application/json'}
                });
            }
            catch (error) {
                console.error(error);
            }
            console.log(postResponse);
        }
    };

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow}>Meld på</Button>

            <Modal show={show} onHide={handleClose}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Påmelding</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                        <Form.Group controlId="formBasicFirstName">
                            <Form.Label>Fornavn</Form.Label>
                            <Form.Control type="text" required placeholder="Skriv inn for- og mellomnavn" onChange={firstNameChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicLastName">
                            <Form.Label>Etternavn</Form.Label>
                            <Form.Control type="text" required placeholder="Skriv inn etternavn" onChange={lastNameChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicClub">
                            <Form.Label>Klubb</Form.Label>
                            <Form.Control type="text" required placeholder="Skriv inn klubbnavn" onChange={clubChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicEventClass">
                            <Form.Label>Velg klasse</Form.Label>
                            <Form.Control as="select" onChange={eventClassChange}>
                                <option>Mini</option>
                                <option>J 08-10</option>
                                <option>J 10-11</option>
                                <option>J 12-13</option>
                                <option>J 14-15</option>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleClose}>Avbryt</Button>
                        <Button variant="outline-primary" type="submit">Meld på</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default RegistrationModal;