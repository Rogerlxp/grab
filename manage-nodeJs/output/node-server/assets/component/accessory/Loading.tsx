import * as React from 'react';
export default function({error}){
    if(error){
        return 'Loading failed.';
    }
    return (
        <div>Loading...</div>
    );
};