import ReactPaginate from 'react-paginate';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Paginate = ({ pageTotal }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const handlePageClick = (event) => {
    if ((searchParams.get('sort') || searchParams.get('sorting')) && searchParams.get('status')) {
      setSearchParams({
        page: event.selected + 1,
        sort: searchParams.get('sort'),
        sorting: searchParams.get('sorting'),
        status: searchParams.get('status') || null,
      });
    } else if (searchParams.get('sort') || searchParams.get('sorting')) {
      setSearchParams({
        page: event.selected + 1,
        sort: searchParams.get('sort'),
        sorting: searchParams.get('sorting'),
      });
    } else {
      setSearchParams({ page: event.selected + 1 });
    }
  };

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({
        page: 1,
      });
    }
    // eslint-disable-next-line
    }, [params]);

  return (
    <>
      <style>
        {`
          .btnContainer {
            display: flex;
            list-style: none;
            padding: 0;
            justify-content: center;
          }

          .btnPage {
            margin: 0 5px;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
          }

          .btnActive {
            background-color: #ff3d00;
            color: #fff;
          }

          .btnPrevious,
          .btnNext {
            margin: 0 5px;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
          }

          .disableBtn {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btnPreviousLink,
          .btnNextLink {
            color: black;
            text-decoration: none;
          }
          
        `}
      </style>
      <ReactPaginate
        forcePage={+searchParams.get('page') - 1 || 0}
        // onPageActive={+searchParams.get('page') - 1 || 0}
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        marginPagesDisplayed={3}
        pageRangeDisplayed={3}
        pageCount={pageTotal}
        previousLabel="< "
        renderOnZeroPageCount={null}
        containerClassName="btnContainer"
        pageClassName="btnPage"
        pageLinkClassName="btnPage"
        activeLinkClassName="btnActive"
        previousLinkClassName="btnPreviousLink"
        previousClassName="btnPrevious"
        nextClassName="btnPrevious"
        nextLinkClassName="btnPreviousLink"
        disabledLinkClassName="disableBtn"
      />
    </>
  );
};

export default Paginate;
