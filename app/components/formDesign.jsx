import React, { useState, useCallback, Component} from 'react';
import {LegacyCard, Tabs} from '@shopify/polaris';

function FormDesign({ formTitle, heading, Submit_Button_Text, handleFormChange, fontSize, color, handleSetColor, saveForm, getAllForm }) {

    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'all-customers-1',
            content: 'Form Heading',
            Component: <FormHeading/>,
        },
        {
            id: 'accepts-marketing-1',
            content: 'Form Element',
            Component: <FormElements/>,
        },
        {
            id: 'repeat-customers-1',
            content: 'Form',
        },
        {
            id: 'prospects-1',
            content: 'Input',
        },
    ];

    return (
        <LegacyCard>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <LegacyCard.Section title={tabs[selected].Component}></LegacyCard.Section>
            </Tabs>
        </LegacyCard>
    );

    function FormHeading() {
        return (
            <>
                <label>Form Title:</label>
                <input type="text" className='form_title' name="formTitle" value={formTitle} onChange={handleFormChange} /><br />

                <label htmlFor="heading">Form Heading:</label>
                <input type="text" id="heading" name="heading" value={heading} onChange={handleFormChange} /><br />

                <label htmlFor="color">Heading Color:</label>
                <input type="color" id="color" value={color} onChange={handleSetColor} /><br /><br />

                <label htmlFor="Submit_Button_Text">Submit Button Text:</label>
                <input type="text" id="Submit_Button_Text" name="Submit_Button_Text" value={Submit_Button_Text} onChange={handleFormChange} /><br />

                <button type="button" onClick={saveForm}>Save Form</button>
                <button type="button" onClick={getAllForm}>Get Saved Form</button>
            </>
        );
    }

    function FormElements() {
        return (
            <>
                <label>First Name: </label>
                <input type="text" className='form_title' name="formTitle" value={formTitle} onChange={handleFormChange} /><br />

                <label htmlFor="heading">Last Name:</label>
                <input type="text" id="heading" name="heading" value={heading} onChange={handleFormChange} /><br />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={fontSize} onChange={handleFormChange} /><br />

                <label htmlFor="number">Phone Number:</label>
                <input type="number" id="number" name="number" value={fontSize} onChange={handleFormChange} /><br />

                <button type="button" onClick={saveForm}>Add Element</button>
            </>
        );
    }
}

export default FormDesign;


{/* <label htmlFor="textAlign">Text Alignment:</label>
            <select id="textAlign" value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select> */}


            