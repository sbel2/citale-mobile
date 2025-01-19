'use client'

import{ createClient } from '@/supabase/client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import Image from "next/legacy/image";
import { categoryList } from '@/components/constants';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

const supabase = createClient();

export default function CreatePostPage() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        mediaUrl: "",
        category: "",
    });

    function handleInput(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {

        const fieldName = e.target.name;
        if (e.target instanceof HTMLInputElement && e.target.type === "file") {
            const fileList = e.target.files;
            console.log(fileList);

            if (fileList) {
                const filesArray = Array.from(fileList).map((file) => URL.createObjectURL(file));
                console.log(filesArray);

                setFormData((prevState) => ({
                    ...prevState,
                    [fieldName]: filesArray,
                }));
            }
        } else {
            const fieldValue = e.target.value;

            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: fieldValue,
            }))
        }

        console.log(formData)
    }

    function submitForm(e: FormEvent) {
        e.preventDefault();

        console.log(formData);
        
        async function postData() {
            const { data, error } = await supabase
            .from('testPost')
            .insert([formData]);

            if (error) {
                console.error('Error Posting data:', error);
                return
            }

            console.log('Data posted!!')
        };

        postData();
    }

    console.log('Boom')

        return (
            <div>
                <form onSubmit={submitForm}  style={styles.form}>
                    <p style={styles.title}>Post an Event!</p>
                    <label htmlFor="eventdata" style={styles.label}> Event Title:
                        <input
                            type="text"
                            id="eventdata"
                            name="title"
                            value={formData.title}
                            onChange={handleInput}
                            style={styles.input}
                            required
                        />
                    </label>
                    <label htmlFor="locationdata" style={styles.label}> Location:
                        <input
                            type="text"
                            id="locationdata"
                            name="location"
                            value={formData.location}
                            onChange={handleInput}
                            style={styles.input}
                            required
                        />
                    </label>
                    <div className="flex">
                        <label htmlFor="descriptiondata" style={styles.label}>Description:</label>
                        <textarea
                            id="descriptiondata"
                            style={styles.input} 
                            rows={5}
                            cols={40}
                            name="description"
                            value={formData.description}
                            onChange={handleInput}
                            
                        />
                    </div>
                    <label htmlFor="urldata" style={styles.label}> Upload Image:
                        <input
                            type="file"
                            id="urldata"
                            name="mediaUrl"
                            multiple
                            accept=".jpg, .jpeg, .png, .svg, .gif"
                            onChange={handleInput}
                            style={styles.specialInput}
                            required
                        />
                    </label>
                    <label htmlFor="category" style={styles.label}> Event Type(s):
                        <select 
                            name="category"
                            id="category"
                            onChange={handleInput}
                            value={formData.category}
                            style={styles.specialInput}
                        >
                            {categoryList.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>
                    <input type="submit" value="Create Post" style={styles.submit}/>
                </form>
            </div>
        )
}


const styles = {
    total: {
      display: 'flex',
      position: 'fixed' as const,
      left: '30%',
      justifyContent: 'center',
      zIndex: 10,
      width: '40%',
      //height: '60%',
    },

    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      width: '100%',
      minWidth: '500px',
      margin: '20px 10px',
      //boxShadow: '0 4px 400px 0 rgba(0, 0, 0, 0.2), 0 6px 400px 0 rgba(0, 0, 0, 0.19)',
      borderRadius: '15px',
      backgroundColor: 'white',
    },

    title: {
      alignSelf: 'center',
      fontSize: '25px',
      //fontFamily: 'Inter SemiBold 600', eventually bold title
      margin: '25px 0px 10px',
    },

    input: {
      backgroundColor: '#f2f3f4',
      borderRadius: '8px',
      margin: '10px 5px',
      height: '30px',
    },

    label: {
      margin: '0px 25px',
      fontSize: '15px',
    },

    specialInput: {
      margin: '10px 5px',
    },

    submit: {
      border: '1px white solid',
      borderRadius: '10px',
      backgroundColor: '#ff0000',
      color: 'white',
      margin: '100px 10px 40px 10px',
      alignSelf: 'flex-end',
      width: '95%',
      height: '35px',
      cursor: 'pointer',
    }
  }