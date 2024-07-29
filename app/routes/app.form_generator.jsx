import React, { useCallback, useState } from 'react';
// import axios from 'axios';
import { useFetcher } from '@remix-run/react';
import FormDesign from '../components/formDesign';
import FormSettings from '../components/formSettings';
import { AppProvider, Page, Layout, Text, Card, Button, BlockStack, Box, List, Link, InlineStack, LegacyCard, Tabs, Grid, TextContainer, Icon } from "@shopify/polaris";

const GenerateForm = () => {
    const fetcher = useFetcher();
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabClick = (tab) => { setActiveTab(tab); };
    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        []
    );

    const [formData, setFormData] = useState({
        formTitle: 'My form',
        heading: 'Contact us',
        Submit_Button_Text: 'Submit',
        fontSize: '26px',
        color: '#000000',
    });

    const [textAlign, setTextAlign] = useState('center');

    const [responseData, setResponseData] = useState([]);
    const [selectedHtmlStructure, setSelectedHtmlStructure] = useState("");

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSetColor = (e) => {
        setFormData({ ...formData, color: e.target.value });
    };

    const saveForm = () => {
        const htmlStructure = document.querySelector('.preview-div').innerHTML;
        const formTitle = document.querySelector('.form_title').value;
        let formData = new FormData();
        formData.append('htmlStructure', htmlStructure);
        formData.append('form_title', formTitle);
        fetcher.submit(formData, { method: 'post', action: '/save_form' });
    };

    const getAllForm = async () => {
        try {
            const response = await fetch('/get_form', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Fetched templates:', responseData);
            setResponseData(responseData.templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const showSingleFrom = async (id) => {
        try {
            const response = await fetch(`/handle_template/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success) {
                setSelectedHtmlStructure(data.htmlStructure);
            }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    };

    const deleteSingleFrom = async (id) => {
        try {
            const response = await fetch(`/handle_template/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // if (data.success) {
            //     setSelectedHtmlStructure(data.htmlStructure);
            // }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
        getAllForm();
    };

    const tabs = [
        {
          id: 'all-customers-1',
          content: 'FormDesign',
          component: <FormDesign formTitle={formData.formTitle} heading={formData.heading} Submit_Button_Text={formData.Submit_Button_Text} handleFormChange={handleFormChange} fontSize={formData.fontSize} color={formData.color} handleSetColor={handleSetColor} saveForm={saveForm} getAllForm={getAllForm} />
          ,
        },
        {
          id: 'accepts-marketing-1',
          content: 'FormSettings',
          component: <FormSettings/>,
        },
    ];

    return (
        <div>
            <div className='customize-section'>
                <h2>Customize Form</h2>
                <LegacyCard>
                    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                        <LegacyCard.Section title={tabs[selected].component}></LegacyCard.Section>
                    </Tabs>
                </LegacyCard>
                {/* <div className="tabs">
                    <Button onClick={() => handleTabClick('tab1')}>Form Settings</Button>
                    <Button onClick={() => handleTabClick('tab2')}>Form Design</Button>
                </div>
                {activeTab === 'tab1' && (<FormSettings />)}
                
                {activeTab === 'tab2' && (
                    <FormDesign
                        formTitle={formData.formTitle}
                        heading={formData.heading}
                        Submit_Button_Text={formData.Submit_Button_Text}
                        handleFormChange={handleFormChange}
                        fontSize={formData.fontSize}
                        color={formData.color}
                        handleSetColor={handleSetColor}
                        saveForm={saveForm}
                        getAllForm={getAllForm}
                    />
                )} */}
                
            <br />
            <h1>Preview Form</h1>
            <div className="preview-div">
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: formData.fontSize, color: formData.color }}>{formData.heading}</h2>
                    <form style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <div>
                            <label>First Name:</label>
                            <input type="text" name="name" />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input type="text" name="name" />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" />
                        </div>
                        <div>
                            <label>Phone Number:</label>
                            <input type="number" name="phoneNumber" />
                        </div>
                        <button type="submit">{formData.Submit_Button_Text}</button>
                    </form>
                </div>
            </div>
            <table className='result'>
                <tr>
                    <th>From ID</th>
                    <th>Form Title</th>
                    <th>Actions</th>
                </tr>
                {responseData.map(template => (
                    <tr key={template.id}>
                        <td>{template.id}</td>
                        <td>
                            <button onClick={() => showSingleFrom(template.id)}> {template.form_title} </button>
                        </td>
                        <td>
                            <button onClick={() => deleteSingleFrom(template.id)}> Delete </button>
                        </td>
                    </tr>
                ))}
            </table>
            {selectedHtmlStructure && (
                <div className="selected-template">
                    <h3>Selected Form</h3>
                    <div dangerouslySetInnerHTML={{ __html: selectedHtmlStructure }} />
                </div>
            )}
        </div>
    </div>
    );
};

export default GenerateForm;