import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Event from '../../model/event';
import { match } from "react-router-dom";
import ParticipantList from '../ParticipantList';
import Firebase from '../Firebase';
import HeaderBar from '../headerbar/HeaderBar';
import EventInfo from './EventInfo';

interface MatchParams {
    eventId: string
}

interface Props {
    match: match<MatchParams>
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;
  
    return (
        <div hidden={value !== index}>
            {value === index && <React.Fragment>{children}</React.Fragment>}
        </div>
    );
  }

const EventPage: React.FC<Props> = (props: Props) => {

    const [event, setEvent] = useState<Event>(new Event("", "", "", "", new Date(), new Date(), new Date(), "", false, false, [], []));
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const eventId = props.match.params.eventId;
        return Firebase.subscribeEvent(eventId, setEvent);
    }, [props.match]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <React.Fragment>
            <HeaderBar heading={event.name}/>
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Informasjon"/>
                    <Tab label={event.startListPublished ? "Startliste" : `Deltakerliste (${event.participants.length})`}/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                <EventInfo event={event}/>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <ParticipantList event={event}/>
            </TabPanel>
        </React.Fragment>
    );
}

export default EventPage;