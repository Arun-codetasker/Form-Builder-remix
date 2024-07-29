import React from 'react'

function FormSettings({ formTitle, heading, Submit_Button_Text, handleFormChange, fontSize, color, handleSetColor, saveForm, getAllForm }) {
    return (
        <>
            <label>Form Title:</label>
            <input type="text" className='form_title' name="formTitle" value={formTitle} onChange={handleFormChange} /><br />
            
            <label htmlFor="heading">Form Heading:</label>
            <input type="text" id="heading" name="heading" value={heading} onChange={handleFormChange} /><br />
            
            <label htmlFor="fontSize">Form Heading Font-Size:</label>
            <input type="text" id="fontSize" name="fontSize" value={fontSize} onChange={handleFormChange} /><br />

            <label htmlFor="color">Heading Color:</label>
            <input type="color" id="color" value={color} onChange={handleSetColor} /><br /><br />

            <label htmlFor="Submit_Button_Text">Submit Button Text:</label>
            <input type="text" id="Submit_Button_Text" name="Submit_Button_Text" value={Submit_Button_Text} onChange={handleFormChange} /><br />

            <button type="button" onClick={saveForm}>Save Form</button>
            <button type="button" onClick={getAllForm}>Get Saved Form</button>
        </>
    );
}

export default FormSettings;