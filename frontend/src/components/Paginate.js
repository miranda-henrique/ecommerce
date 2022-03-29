import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const Paginate = ({ keyword = '', currentPage, numOfPages, isAdmin = false }) => {
    return (
        numOfPages > 1 && (
            <Pagination>
                {[...Array(numOfPages).keys()].map((index) => (
                    <LinkContainer
                        key={index + 1}
                        to={
                            !isAdmin
                                ? keyword
                                    ? `/search/${keyword}/page/${index + 1}`
                                    : `/page/${index + 1}`
                                : `/admin/productlist/${index + 1}`
                        }>
                        <Pagination.Item active={index + 1 === currentPage}>
                            {index + 1}
                        </Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    );
};


export default Paginate;