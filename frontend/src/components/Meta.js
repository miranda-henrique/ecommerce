import React from 'react';
import { Helmet } from 'react-helmet';


const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
        </Helmet>
    );
};

Meta.defaultProps = {
    title: 'Welcome to the MERN Ecommerce!',
    description: 'Ecommerce project built with the MERN stack!',
    keywords: 'javascript, react, nodejs, express, mongodb',
};


export default Meta;