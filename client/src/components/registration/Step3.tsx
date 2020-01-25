import React from 'react';
import Button from '@material-ui/core/Button';

interface Props {
    registerMoreCallback: () => void
}

const Step3: React.FC<Props> = (props: Props) => {

    return (
        <div style={{textAlign: 'center', fontWeight: 'bold'}}>
            <p>Din påmelding er registrert!</p>
            <Button variant="contained" color="primary" className="float-right" onClick={props.registerMoreCallback}>Meld på flere</Button>
        </div>
    )
}

export default Step3;