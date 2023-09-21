import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import CommonModal from "../common/core/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContactData,
  fetchDataError,
  fetchDataSuccess,
} from "../redux/api";
import { Scrollbars } from "react-custom-scrollbars";

const Home = () => {
  const contact = useSelector((state) => state.contact.contactList);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const [modalHeading, setModalHeading] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [currentSelectedButton, setCurrentSelectedButton] = useState("");
  const [checkedOnlyEven, setCheckedOnlyEven] = useState(false);
  const [contactList, setContactList] = useState(contact);
  const [currentSelectedContactIdDetails, setCurrentSelectedContactIdDetails] =
    useState({});
  const [searchText, setSearchText] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const buttonLabels = [
    { id: "all", text: "All Contacts", class: "buttonA" },
    { id: "us", text: "US Contacts", class: "buttonB" },
  ];
  const isFetchingData = useRef(false);

  useEffect(() => {
    setSearchText("");
    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (table) {
        table.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setContactList(contact);
  }, [contact]);

  useEffect(() => {
    if (contactList !== null) {
      const data = filterContacts();
      setContactList(data);
    }
  }, [checkedOnlyEven]);

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      if (currentSelectedButton === "all") {
        handleFetchData({
          companyId: 171,
          page: 1,
          query: searchText,
        });
      } else if (currentSelectedButton === "us") {
        handleFetchData({
          companyId: 171,
          countryId: 226,
          page: 1,
          query: searchText,
        });
      }
    }, 1000);

    setTypingTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    if (currentSelectedButton !== "") {
      if (currentSelectedButton === "all") {
        handleFetchData({ companyId: 171, page: 1, query: searchText });
      } else if (currentSelectedButton === "us") {
        handleFetchData({
          companyId: 171,
          countryId: 226,
          page: 1,
          query: searchText,
        });
      } else handleClose();
    }
  }, [currentSelectedButton]);

  const handleClose = () => setShow(false);

  const handleClose2 = () => setShow2(false);

  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight && !isFetchingData.current) {
        loadMoreData();
      }
      if (scrollTop === 0 && !isFetchingData.current) {
        loadPreviousData();
      }
    }
  };

  const filterContacts = () => {
    if (checkedOnlyEven) {
      const { contacts_ids, contacts } = contactList;
      const filteredContactIds = contacts_ids.filter((id) => id % 2 === 0);

      const filteredContacts = {};
      filteredContactIds.forEach((contactId) => {
        filteredContacts[contactId] = contacts[contactId];
      });

      return {
        ...contactList,
        contacts_ids: filteredContactIds,
        contacts: filteredContacts,
      };
    } else {
      return {
        ...contact,
      };
    }
  };

  const handleFetchData = (params) => {
    if (currentSelectedButton) {
      setIsLoading(true);

      dispatch(fetchContactData(params))
        .then((response) => {
          dispatch(fetchDataSuccess(response.data));
        })
        .catch((error) => {
          dispatch(fetchDataError(error));
        })
        .finally(() => {
          setIsLoading(false);
          isFetchingData.current = false;
        });
    }
  };

  const loadMoreData = () => {
    if (currentSelectedButton) {
      isFetchingData.current = true;
    }
    let params = {
      companyId: 171,
      page: page + 1,
    };
    if (currentSelectedButton === "us") {
      params.countryId = 226;
    }

    setIsLoading(true);

    dispatch(fetchContactData(params))
      .then((response) => {
        dispatch(fetchDataSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchDataError(error));
      })
      .finally(() => {
        setIsLoading(false);
        isFetchingData.current = false;
      });
  };

  const loadPreviousData = () => {
    if (currentSelectedButton) {
      isFetchingData.current = true;
    }

    if (page > 1) {
      setPage(page - 1);

      let params = {
        companyId: 171,
        page: page - 1,
      };

      if (currentSelectedButton === "us") {
        params.countryId = 226;
      }

      setIsLoading(true);

      dispatch(fetchContactData(params))
        .then((response) => {
          dispatch(fetchDataSuccess(response.data));
        })
        .catch((error) => {
          dispatch(fetchDataError(error));
        })
        .finally(() => {
          setIsLoading(false);
          isFetchingData.current = false;
        });
    }
  };

  const handleShow = (heading) => {
    if (heading === "Button A") setCurrentSelectedButton("all");
    else if (heading === "Button B") setCurrentSelectedButton("us");
    setModalHeading(heading);
    setShow(true);
  };

  const handleButtonClick = (id) => {
    setCurrentSelectedButton(id);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);
  };

  const buttonLabelsUI = () => {
    return (
      <Row>
        <Col xs={12} className="flex flex-col mb-3">
          {buttonLabels?.map((label, index) => (
            <Button
              key={index}
              variant="secondary"
              className={`mr-2 ${label.class} ${
                currentSelectedButton === label.id ? "active-btn" : ""
              }`}
              onClick={() => handleButtonClick(label.id)}
            >
              {label.text}
            </Button>
          ))}
        </Col>
        <Col md={4} xs={12} className="form-group ml-auto">
          <input
            type="text"
            className="form-control"
            value={searchText}
            onChange={handleSearchChange}
            // onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search here"
          />
        </Col>
      </Row>
    );
  };

  const handleContactItemClick = (contactId) => {
    setCurrentSelectedContactIdDetails(contactList.contacts[contactId]);
    setShow2(!show2);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (currentSelectedButton === "all") {
        handleFetchData({ companyId: 171, page: 1, query: searchText });
      } else if (currentSelectedButton === "us") {
        handleFetchData({
          companyId: 171,
          countryId: 226,
          page: 1,
          query: searchText,
        });
      }
    }
  };

  console.log("currentSelectedButton : ", currentSelectedButton);
  return (
    <>
      <div className="d-flex justify-content-center h-screen align-items-center min-vh-100">
        <Button
          variant="primary"
          type="button"
          className={`btn buttonA mr-3 ${
            currentSelectedButton === "all" ? "active-btn" : ""
          }`}
          onClick={() => handleShow("Button A")}
        >
          Button A
        </Button>
        <Button
          variant="primary"
          type="button"
          className={`btn buttonB ${
            currentSelectedButton === "us" ? "active-btn" : ""
          }`}
          onClick={() => handleShow("Button B")}
        >
          Button B
        </Button>
      </div>

      <CommonModal
        show={show}
        handleClose={handleClose}
        modalHeading={modalHeading}
        size="lg"
      >
        {buttonLabelsUI()}

        <div
          ref={tableRef}
          style={{
            height: "300px",
            overflowY: "hidden",
            border: "1px solid #ccc",
          }}
        >
          <Scrollbars autoHide onScroll={handleScroll}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={"4"} align="center">
                      <div className="spinner-border"></div>
                    </td>
                  </tr>
                ) : contactList !== null &&
                  contactList.contacts_ids.map((contactId) => (
                    <tr
                      key={contactId}
                      onClick={() => handleContactItemClick(contactId)}
                    >
                      <td>{contactList.contacts[contactId].id}</td>
                      <td>{contactList.contacts[contactId].first_name}</td>
                      <td>{contactList.contacts[contactId].email}</td>
                      <td>{contactList.contacts[contactId].phone_number}</td>
                    </tr>
                  )) ? (
                  contactList.contacts_ids.length === 0 && (
                    <tr>
                      <td colSpan={"4"} align="center">
                        <div className="text-center">No Data Found</div>
                      </td>
                    </tr>
                  )
                ) : null}
              </tbody>
            </table>
          </Scrollbars>
        </div>

        <div className="d-flex align-items-baseline">
          <input
            type="checkbox"
            id="llls"
            checked={checkedOnlyEven}
            onChange={() => setCheckedOnlyEven(!checkedOnlyEven)}
            className="form-control w-auto h-fit flex-shrink-0 mr-2"
          />
          <label htmlFor="llls" className="label-text mb-0">
            Only even
          </label>
        </div>
      </CommonModal>

      <CommonModal
        show={show2}
        handleClose={handleClose2}
        modalHeading={`Contact Details`}
      >
        <p className="mb-1">
          <strong>ID: </strong>
          {currentSelectedContactIdDetails.id}
        </p>

        <p className="mb-1">
          <strong>First Name: </strong>{" "}
          {currentSelectedContactIdDetails.first_name !== "undefined"
            ? currentSelectedContactIdDetails.first_name
            : "-"}
        </p>
        <p className="mb-1">
          <strong>Last Name: </strong>{" "}
          {currentSelectedContactIdDetails.last_name !== "undefined"
            ? currentSelectedContactIdDetails.last_name
            : "-"}
        </p>
        <p className="mb-1">
          <strong>Email: </strong>{" "}
          {currentSelectedContactIdDetails.email !== ""
            ? currentSelectedContactIdDetails.email
            : "-"}
        </p>
        <p className="mb-1">
          <strong>Phone Number:</strong>{" "}
          {currentSelectedContactIdDetails.phone_number || "-"}
        </p>
        <p className="mb-1">
          <strong>Comment:</strong>{" "}
          {currentSelectedContactIdDetails.comment || "-"}
        </p>
        <p className="mb-1">
          <strong>Address:</strong>{" "}
          {currentSelectedContactIdDetails.address || "-"}
        </p>
      </CommonModal>
    </>
  );
};

export default Home;
