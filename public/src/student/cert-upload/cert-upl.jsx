import React, { useState, useEffect, useContext } from "react";
import spider from "../../utils/API";
import { StatusContext } from "../../contexts/StatusContext";
import { ToastContainer } from "react-toastify";
import { Modal } from "react-bootstrap"; //eslint-disable-next-line
import CertificateTemplate from "../cert-templates/cert-temp";
import SemCheckboxes from "./formFields/SemCheckboxes";
import CourseDetails from "./formFields/CourseDetails";
import Purpose from "./formFields/Purpose";
import Contact from "./formFields/Contact";
import NoOfCopies from "./formFields/NoOfCopies";
import FeeRef from "./formFields/FeeRef";
import Loader from "react-loader-spinner";
import InstructionsModal from "../instructions-modal/instructions";
import SignatoriesInstructionsModal from "../instructions-modal/signatories-instructions";
import FilesModal from "./formFields/FilesModal";
import { MdHelp } from "react-icons/md";
import store from "../../store";
import {
  setName,
  setEmails,
  setCertPdf,
  setEmailCount,
  setIdPdf,
  setCertFileName,
  setIdFileName,
  setInstructionModal,
  setSignatoriesModal,
  setCode,
  setCourse,
  setPurpose,
  setContact,
  setNoOfCopies,
  setFee,
  setFile
} from "../../actions";
import "./cert-upl.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Upload(props) {
  const user = JSON.parse(localStorage.getItem("bonafideNITT2020user")).user;
  let SemObj = [
    { id: 1, sem: "s1", semName: "Sem 1", copies: 0 },
    { id: 2, sem: "s2", semName: "Sem 2", copies: 0 },
    { id: 3, sem: "s3", semName: "Sem 3", copies: 0 },
    { id: 4, sem: "s4", semName: "Sem 4", copies: 0 },
    { id: 5, sem: "s5", semName: "Sem 5", copies: 0 },
    { id: 6, sem: "s6", semName: "Sem 6", copies: 0 },
    { id: 7, sem: "s7", semName: "Sem 7", copies: 0 },
    { id: 8, sem: "s8", semName: "Sem 8", copies: 0 },
    { id: 9, sem: "s9", semName: "Sem 9", copies: 0 },
    { id: 10, sem: "s10", semName: "Sem 10", copies: 0 },
  ];

  // UPLOAD DATA

  // const [file, setFile] = useState("bonafide"); reduxed
  const [docId, setDocId] = useState([]);

  const [semester, setSemester] = useState(SemObj);
  const [semwiseMap, setSemwiseMap] = useState(false);

  //const [feeReceipt, setFee] = useState(""); reduxed
  const [emailDel, setEmailDel] = useState("");
  const [address, setAddress] = useState("");
  const [preAddress, setPreAddr] = useState([]);
  //const [contact, setContact] = useState(""); reduxed
  //const [purpose, setPurpose] = useState(""); reduxed
  //const [no_of_copies, setNoOfCopies] = useState(0); reduxed
  //const [courseCode, setCode] = useState(""); reduxed
  //const [course, setCourse] = useState(""); reduxed

  // MODAL AND LOADING VARIABLES

  const [fileModal, setFileModal] = useState(false);
  //const [instructionsModal, setInstructionsModal] = useState(true); reduxed
  //const [signatoriesModal, setSignatoriesModal] = useState(false); reduxed
  const [addressModal, setAddressModal] = useState(false);
  const [showModal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [cert_fileButton, setCertFileButton] = useState("");
  const [id_fileButton, setIdFileButton] = useState("");

  const statusCtx = useContext(StatusContext);

  useEffect(() => {
    spider
      .get("/api/student/certificate_types")
      .then((res) => {
        res.data.forEach((add) => {
          setDocId((p) => p.concat(add));
        });
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    spider
      .get("/api/student/address")
      .then((res) => {
        res.data.forEach((add) => {
          setPreAddr((p) => p.concat(add));
        });
      })
      .catch((err) => {});
  }, []);

  const refreshStatus = () => {
    statusCtx.refreshCertData();
  };

  const setCopies = (semNo, noCopies) => {
    SemObj[semNo - 1].copies = noCopies;
    setSemester(SemObj);
  };

  const handleSubmitClose = () => setModal(false);
  const handleAddressClose = () => setAddressModal(false);

  const handleCertFileUpload = (e) => {
    if (e.target.files[0]) {
      let filePath = e.target.value;
      var allowedExtensions = /(\.docx|\.DOCX|\.doc|\.DOC|\.pdf|\.PDF)$/;
      if (!allowedExtensions.exec(filePath)) {
        e.target.value = "";
        document.getElementById("file-error-message").innerHTML =
          "File extension must be .doc, .docx or .pdf";
      } else {
        document.getElementById("file-error-message").innerHTML = "";
        store.dispatch(setCertPdf(URL.createObjectURL(e.target.files[0])));
        setCertFileButton(true);
        store.dispatch(setCertFileName(e.target.files[0].name));
      }
    } else {
      store.dispatch(setCertFileName(null));
      setCertFileButton(true);
    }
  };

  const handleIdFileUpload = (e) => {
    if (e.target.files[0]) {
      let filePath = e.target.value;
      var allowedExtensions = /(\.docx|\.DOCX|\.doc|\.DOC|\.pdf|\.PDF)$/;
      if (!allowedExtensions.exec(filePath)) {
        e.target.value = "";
        document.getElementById("file-error-message").innerHTML =
          "File extension must be .doc, .docx or .pdf";
      } else {
        document.getElementById("file-error-message").innerHTML = "";
        store.dispatch(setIdPdf(URL.createObjectURL(e.target.files[0])));
        setIdFileButton(true);
        store.dispatch(setIdFileName(e.target.files[0].name));
      }
    } else {
      store.dispatch(setIdFileName(null));
      setIdFileButton(true);
    }
  };

  const handleClose = () => setFileModal(false);
  const handleFileOpen = () => setFileModal(true);

  const handleInstructionsClose = () =>
    store.dispatch(setInstructionModal(false));
  const handleInstructionsOpen = () =>
    store.dispatch(setInstructionModal(true));

  const handleSignatoriesClose = () =>
    store.dispatch(setSignatoriesModal(false));
  const handleSignatoriesOpen = () => store.dispatch(setSignatoriesModal(true));

  const certificateRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    let fileUpload = document.getElementById("cert").files[0];
    let college_id = document.getElementById("college-id").files[0];
    let cd = new FormData();
    for (var i = 0; i < docId.length; i++) {
      if (docId[i] && docId[i].name.toLowerCase() === store.getState().file.toLowerCase()) {
        cd.set("type", parseInt(docId[i].id));
      }
    }
    cd.append("certificate", fileUpload);
    cd.append("certificate", college_id);
    if (
      store.getState().file === "course de-registration" ||
      store.getState().file === "course re-registration"
    ) {
      cd.set("course_code", store.getState().courseCode);
      cd.set("course_name", store.getState().course);
    }
    if (semwiseMap === true) {
      let sems = "",
        copies = "";
      semester.forEach((entry) => {
        if (entry.copies !== 0) {
          if (sems === "") sems += "" + entry.id;
          else sems += "," + entry.id;

          if (copies === "") copies += "" + entry.copies;
          else copies += "," + entry.copies;
        }
      });

      cd.set("semester_no", sems);
      cd.set("rank_grade_card_copies", copies);
    }
    if (
      (emailDel &&
        document.getElementById("email-sel").checked &&
        store.getState().file === "transcript") ||
      semwiseMap === true ||
      store.getState().file === "rank card"
    )
      cd.set("email", emailDel);
    if (
      (address &&
        document.getElementById("postal-del").checked &&
        store.getState().file === "transcript") ||
      semwiseMap === true ||
      store.getState().file === "rank card"
    )
      cd.set("address", address);
    if (store.getState().feeReceipt)
      cd.set("receipt", store.getState().feeReceipt);
    if (store.getState().contact) cd.set("contact", store.getState().contact);
    if (store.getState().purpose) cd.set("purpose", store.getState().purpose);
    if (store.getState().name) cd.set("name", store.getState().name);
    if (store.getState().file === "transcript" || store.getState().file === "rank card") {
      if (store.getState().no_of_copies)
        cd.set("no_copies", store.getState().no_of_copies);
    }
    cd.set("path", store.getState().emails.toString()); //eslint-disable-next-line
    for (var pair of cd.entries()) {
    }
    spider
      .post("api/student/certificate_request", cd)
      .then((res) => {
        setModal(false);
        setLoading(false);
        store.dispatch(setEmailCount(0));
        store.dispatch(setEmails([]));
        setCertFileButton(false);
        setIdFileButton(false);
        setFileModal(false);
        setAddress("");
        setEmailDel("");
        store.dispatch(setFee(""));
        store.dispatch(setPurpose(""));
        store.dispatch(setContact(""));
        store.dispatch(setCertPdf(null));
        store.dispatch(setIdPdf(null));
        store.dispatch(setCertFileName(""));
        store.dispatch(setIdFileName(""));
        setPreAddr([]);
        store.dispatch(setCourse(""));
        store.dispatch(setCode(""));
        store.dispatch(setName(""));
        SemObj.forEach((obj) => {
          obj.copies = 0;
        });
        setSemester(SemObj);
        store.dispatch(setNoOfCopies(null));
        spider
          .get("/api/student/address")
          .then((res) => {
            res.data.forEach((add) => {
              setPreAddr((p) => p.concat(add));
            });
          })
          .catch((err) => {});

        refreshStatus();

        document.getElementById("cert").value = "";
        if (document.getElementById("emaildel"))
          document.getElementById("emaildel").value = "";
        if (document.getElementById("feer"))
          document.getElementById("feer").value = "";
        if (document.getElementById("emaildel"))
          document.getElementById("emaildel").value = "";
        if (document.getElementById("postal-del"))
          document.getElementById("postal-del").value = "";
        if (document.getElementById("no_of_copies"))
          document.getElementById("no_of_copies").value = "";
        document.getElementById("contact-number").value = "";
        document.getElementById("purpose").value = "";
        document.getElementById("college-id").value = "";
        document.getElementById("username").value = "";
        let copyInputDivNodes = document.querySelectorAll(".copy-input-div");
        if (copyInputDivNodes) {
          copyInputDivNodes.forEach((node) => node.remove());
        }
        document.getElementById("certType").value = "bonafide";
        store.dispatch(setFile("bonafide"));
        setSemwiseMap(false);
      })
      .catch((err) => {});
  };
  const calculate_source = () => {
    let anch = document.getElementById("anchorClick");
    if (anch) {
      let certType = document.getElementById("certType");
      if (certType) {
        let value = certType.value;
        if (value === "bonafide") anch.href = "Documents/bonafide.pdf";
        else if (value === "transcript") anch.href = "Documents/transcript.pdf";
        // anch.click();
      }
    }
  };
  return (
    <>
      <div className="container" id="cert-upl">
        <h2 className="text-center cert-upl-head">
          Document Requisition Portal
        </h2>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="row">
          <div className="col-md-6 form-left">
            {/* Name */}

            <div className="form-group">
              <label htmlFor="username">
                Enter your Name <span className="cmpl">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="contact"
                id="username"
                placeholder="Name"
                required
                onChange={(e) => {
                  store.dispatch(setName(e.target.value));
                }}
              />
              <small id="name-error-message" className="error"></small>
            </div>

            {/* Certificate Type */}

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              {store.getState().file === "bonafide" || store.getState().file === "transcript" ? (
                <a
                  href="#!"
                  onClick={calculate_source}
                  id="anchorClick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="float-right small-link"
                >
                  Download Template
                </a>
              ) : (
                <></>
              )}
            </div>
            <form id="request-main">
              <div className="form-group">
                <label htmlFor="certType">
                  Enter Document type <span className="cmpl">*</span>
                  <MdHelp
                    onClick={handleInstructionsOpen}
                    style={{ position: "absolute", right: "1em" }}
                  />
                </label>

                <select
                  name="certType"
                  id="certType"
                  className="form-control"
                  onChange={(e) => {
                    let certType = e.target.value;
                    store.dispatch(setFile(certType));
                    docId.forEach((type) => {
                      if (type.name.toLowerCase() === certType) {
                        if (type.semwise_mapping === true) setSemwiseMap(true);
                        else setSemwiseMap(false);
                      }
                    });
                    // setName("");
                    // document.getElementById("username").value = "";
                    if (
                      store.getState().file === "course de-registration" ||
                      store.getState().file === "course re-registration"
                    ) {
                      if(document.getElementById('course-code') && document.getElementById("course-name"))
                      {
                        document.getElementById("course-code").value = "";
                        document.getElementById("course-name").value = "";
                      }
                      store.dispatch(setCourse(""));
                      store.dispatch(setCode(""));
                    }
                    if (
                      certType === "transcript" ||
                      certType === "rank card" ||
                      certType === "grade card"
                    ) {
                      store.dispatch(
                        setEmailCount(store.getState().emailCount + 1)
                      );
                      store.dispatch(setEmails(["transcript@nitt.edu"]));
                      document.getElementById(
                        "contact-error-message"
                      ).innerHTML = "";
                      if(document.getElementById("purpose-error-message"))
                      {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "";
                      }
                      document.getElementById("file-error-message").innerHTML =
                        "";
                    } else {
                      store.dispatch(setEmailCount(0));
                      store.dispatch(setEmails([]));
                      document.getElementById(
                        "contact-error-message"
                      ).innerHTML = "";
                      document.getElementById(
                        "purpose-error-message"
                      ).innerHTML = "";
                      document.getElementById("file-error-message").innerHTML =
                        "";
                      if (document.getElementById("ccode-error-message")) {
                        document.getElementById(
                          "ccode-error-message"
                        ).innerHTML = "";
                      }
                      if (document.getElementById("cname-error-message")) {
                        document.getElementById(
                          "cname-error-message"
                        ).innerHTML = "";
                      }
                      if (document.getElementById("email-error-message")) {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "";
                      }
                    }
                  }}
                >
                  {docId.map((id, index) => {
                    return (
                      <option key={index} value={id.name.toLowerCase()}>
                        {id.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Certificate Delivery */}

              {store.getState().file === "transcript" ||
              store.getState().file === "rank card" ||
              semwiseMap === true ? (
                <>
                  <div className="form-group">
                    <label htmlFor="delivery-sel">
                      Select document delivery method{" "}
                      <span className="cmpl">*</span>
                    </label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="email-sel"
                        id="email-sel"
                        value="email"
                        onChange={(e) => {
                          if (document.getElementById("email-sel").checked) {
                            document.getElementById(
                              "email-del-entry"
                            ).style.display = "block";
                          } else {
                            document.getElementById(
                              "email-del-entry"
                            ).style.display = "none";
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor="email">
                        Email
                      </label>
                    </div>

                    {/* Email delivery */}

                    <div id="email-del-entry">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          name="email-del"
                          id="emaildel"
                          aria-describedby="emailHelp"
                          placeholder="Email Id"
                          onChange={(e) => {
                            e.preventDefault();
                            let emailValues = document.getElementById(
                              "emaildel"
                            );
                            // if (emailValues.value !== "") {
                            setEmailDel(emailValues.value);
                            // }
                          }}
                          required
                        />
                        <small
                          id="your-email-error-message"
                          className="error"
                        ></small>
                      </div>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="postal"
                        id="postal-del"
                        value="postal"
                        onChange={(e) => {
                          if (document.getElementById("postal-del").checked) {
                            document.getElementById(
                              "postal-del-entry"
                            ).style.display = "block";
                          } else {
                            document.getElementById(
                              "postal-del-entry"
                            ).style.display = "none";
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor="postal">
                        Postal delivery
                      </label>
                    </div>
                    <small
                      id="select-delivery-type-error-message"
                      className="error"
                    ></small>
                  </div>

                  {/* Postal information */}

                  <>
                    <div id="postal-del-entry" className="text-center">
                      <p id="emailHelp" className="form-text text-muted">
                        Choose addresses from your previous entries:
                      </p>
                      {preAddress.length !== 0 ? (
                        preAddress.map((addr, index) => {
                          if (addr !== "" || addr !== " ")
                            return (
                              <div className="form-check" key={index}>
                                <input
                                  className="form-check-input radio-addr"
                                  type="radio"
                                  name="radio"
                                  id={"radio" + index}
                                  value={addr !== null ? addr : ""}
                                  onChange={(e) => {
                                    setAddress(e.target.value);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="radio"
                                >
                                  {addr}
                                </label>
                              </div>
                            );
                          return 0;
                        })
                      ) : (
                        <small className="form-text text-muted">
                          No previously saved addresses.
                        </small>
                      )}
                      <br />
                      {address ? (
                        <>
                          <small className="form-text text-muted">
                            Address entered/selected: <strong>{address}</strong>
                          </small>
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      <small className="form-text text-muted">
                        Else, enter a new one:
                      </small>
                      <br />
                      <div className="text-center">
                        <button
                          className="btn btn-success p-1 m-1"
                          width="50"
                          type="button"
                          onClick={(e) => {
                            setAddressModal(true);
                            Array.prototype.forEach.call(
                              document.getElementsByClassName("radio-addr"),
                              (el) => {
                                if (el.checked) {
                                  el.checked = false;
                                }
                              }
                            );
                          }}
                        >
                          Add New Address
                        </button>
                        <br />
                        <small
                          id="your-postal-error-message"
                          className="error"
                        ></small>
                      </div>
                      <br />
                      <Modal
                        show={addressModal}
                        onHide={handleAddressClose}
                        keyboard={false}
                        dialogClassName="approveModal"
                        aria-labelledby="contained-modal-title-vcenter"
                        className="certModal"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Add New Address
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <br />
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                Address <span className="cmpl">*</span>
                              </span>
                            </div>
                            <textarea
                              id="address-text-box1"
                              className="form-control"
                              aria-label="With textarea"
                            ></textarea>
                          </div>
                          <br />
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                Pin Code <span className="cmpl">*</span>
                              </span>
                            </div>
                            <input
                              type="number"
                              id="address-text-box2"
                              className="form-control"
                            ></input>
                          </div>
                          <br />
                          <small
                            id="emailHelp"
                            className="form-text text-muted"
                          >
                            Optional
                          </small>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Landmark</span>
                            </div>
                            <textarea
                              id="address-text-box3"
                              className="form-control"
                              aria-label="With textarea"
                            ></textarea>
                          </div>
                          <br />
                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              onClick={(e) => {
                                let addr = document.getElementById(
                                  "address-text-box1"
                                ).value;
                                let pin = document.getElementById(
                                  "address-text-box2"
                                ).value;
                                let landm = document.getElementById(
                                  "address-text-box3"
                                ).value;
                                if (addr && pin) {
                                  let addressText =
                                    addr +
                                    " ," +
                                    pin +
                                    (landm ? " ," + landm : "");
                                  setAddress(addressText);
                                  setAddressModal(false);
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </>
                  <br />
                </>
              ) : (
                <></>
              )}
              {/* Course Deregistration/Registration */}
              {store.getState().file === "course de-registration" ||
              store.getState().file === "course re-registration" ? (
                <CourseDetails></CourseDetails>
              ) : (
                <></>
              )}

              {/* Contact information */}
              <Contact></Contact>

              {/* Fee Receipt */}
              <FeeRef file={store.getState().file} semwiseMap={semwiseMap}></FeeRef>

              {/*Semester and #copies for grade card */}
              <SemCheckboxes semester={semester}></SemCheckboxes>

              {/* Administrator Email Addition */}
              {store.getState().file === "transcript" ||
              store.getState().file === "rank card" ||
              semwiseMap === true ? (
                <></>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="emailaddr">
                      Enter Signatories' Email address{" "}
                      <span className="cmpl">*</span>
                      <MdHelp
                        onClick={handleSignatoriesOpen}
                        style={{ position: "absolute", right: "1em" }}
                      />
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="emailaddr"
                      id="emailaddr"
                      aria-describedby="emailHelp"
                      placeholder="Email addresses in the order of processing"
                      required
                      onChange={(e) => {
                        var format = /[ `!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/; // eslint-disable-line
                        if (format.test(e.target.value)) {
                          document.getElementById(
                            "email-error-message"
                          ).innerHTML = "No special characters allowed";
                        } else {
                          document.getElementById(
                            "email-error-message"
                          ).innerHTML = "";
                        }
                      }}
                    />
                    <small id="email-error-message" className="error"></small>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        let emailValues = document.getElementById("emailaddr");
                        if (emailValues.value !== "") {
                          const re = /\S+@nitt\.edu/;
                          const student_webmail = /^\d+@nitt\.edu/;
                          const format = /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/; // eslint-disable-line
                          if (format.test(emailValues.value) === true) {
                            alert("No special characters allowed");
                          } else if (re.test(emailValues.value) === true) {
                            if (
                              student_webmail.test(emailValues.value) === true
                            ) {
                              alert("Cannot enter student webmail");
                            } else if (
                              !store
                                .getState()
                                .emails.includes(emailValues.value)
                            ) {
                              store.dispatch(
                                setEmailCount(store.getState().emailCount + 1)
                              );
                              store.dispatch(
                                setEmails(
                                  store
                                    .getState()
                                    .emails.concat(emailValues.value)
                                )
                              );
                            } else {
                              alert("Duplicate entry!");
                            }
                          } else {
                            alert("Enter valid nitt email.");
                          }
                          emailValues.value = "";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
              <br />

              {/* Purpose */}
              <Purpose file={store.getState().file} semwiseMap={semwiseMap}></Purpose>

              {/* No of copies */}

              <NoOfCopies file={store.getState().file}></NoOfCopies>

              {/* Certificate Addition */}
              <div className="form-group">
                <label htmlFor="cert" style={{ width: "50%" }}>
                  Upload Document <span className="cmpl">*</span>
                </label>
                <label htmlFor="college-id" style={{ width: "50%" }}>
                  Upload Student ID <span className="cmpl">*</span>
                </label>
                <input
                  type="file"
                  // className="form-control-file"
                  onChange={handleCertFileUpload}
                  id="cert"
                  style={{ width: "50%" }}
                />
                <input
                  type="file"
                  // className="form-control-file"
                  id="college-id"
                  onChange={handleIdFileUpload}
                  style={{ width: "50%" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1em",
                    margin: "1em",
                  }}
                >
                  <small id="file-error-message" className="error"></small>
                </div>

                <span style={{ display: "flex", justifyContent: "center" }}>
                  {cert_fileButton && id_fileButton === true ? (
                    <button
                      type="button"
                      className="btn btn-primary mr-2 mobl-btn"
                      onClick={handleFileOpen}
                      style={{ margin: "0.5em", width: "50%", minWidth: "2em" }}
                    >
                      Show Uploaded Files
                    </button>
                  ) : (
                    <></>
                  )}
                </span>
              </div>
              <div className="form-group text-center">
                <br />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault();
                    let fileUpload = document.getElementById("cert").files[0];
                    let college_id = document.getElementById("college-id")
                      .files[0];
                    let error = 0;
                    if (!store.getState().contact) {
                      document.getElementById(
                        "contact-error-message"
                      ).innerHTML = "Contact field cannot be blank";
                      error = 1;
                    } else {
                      // const re = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
                      if (store.getState().contact.length !== 10) {
                        document.getElementById(
                          "contact-error-message"
                        ).innerHTML = "Enter a valid contact number";
                        error = 1;
                      } else {
                        document.getElementById(
                          "contact-error-message"
                        ).innerHTML = "";
                      }
                    }
                    if (!store.getState().name) {
                      document.getElementById("name-error-message").innerHTML =
                        "Name field cannot be blank";
                      error = 1;
                    } else {
                      document.getElementById("name-error-message").innerHTML =
                        "";
                    }
                    if (!store.getState().purpose) {
                      if (
                        store.getState().file === "bonafide" ||
                        store.getState().file === "transcript" ||
                        store.getState().file === "rank card" ||
                        semwiseMap === true
                      ) {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "Purpose field cannot be blank";
                      } else if (store.getState().file === "course de-registration") {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "Enter reason for course de-registration";
                      } else {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "Enter reason for course re-registration";
                      }
                      error = 1;
                    } else {
                      document.getElementById(
                        "purpose-error-message"
                      ).innerHTML = "";
                    }
                    if (!fileUpload || !college_id) {
                      document.getElementById("file-error-message").innerHTML =
                        "Upload both files";
                      error = 1;
                    } else {
                      document.getElementById("file-error-message").innerHTML =
                        "";
                    }
                    if (store.getState().file === "bonafide") {
                      if (!store.getState().emailCount) {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "Add email addresses";
                        error = 1;
                      } else {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "";
                      }
                    } else if (
                      store.getState().file === "transcript" ||
                      semwiseMap === true ||
                      store.getState().file === "rank card"
                    ) {
                      if (store.getState().file === "transcript" || store.getState().file === "rank card") {
                        if (store.getState().no_of_copies < 0) {
                          document.getElementById(
                            "no-of-copies-error-message"
                          ).innerHTML = "Number of copies cannot be negative";
                          error = 1;
                        } else {
                          document.getElementById(
                            "no-of-copies-error-message"
                          ).innerHTML = "";
                        }
                        if (address) {
                          if (!store.getState().no_of_copies) {
                            document.getElementById(
                              "no-of-copies-error-message"
                            ).innerHTML = "Enter the number of copies required";
                            error = 1;
                          } else if (store.getState().no_of_copies <= 0) {
                            document.getElementById(
                              "no-of-copies-error-message"
                            ).innerHTML = "Enter the number of copies required";
                            error = 1;
                          } else {
                            document.getElementById(
                              "no-of-copies-error-message"
                            ).innerHTML = "";
                          }
                        }
                        if (!store.getState().feeReceipt) {
                          document.getElementById(
                            "fee-error-message"
                          ).innerHTML = "Enter fee reference number";
                          error = 1;
                        } else {
                          document.getElementById(
                            "fee-error-message"
                          ).innerHTML = "";
                        }
                      }
                      if (
                        !(
                          document.getElementById("email-sel").checked ||
                          document.getElementById("postal-del").checked
                        )
                      ) {
                        document.getElementById(
                          "select-delivery-type-error-message"
                        ).innerHTML = "Select a delivery method";
                        error = 1;
                      } else {
                        document.getElementById(
                          "select-delivery-type-error-message"
                        ).innerHTML = "";
                      }
                      if (document.getElementById("email-sel").checked) {
                        if (!emailDel) {
                          document.getElementById(
                            "your-email-error-message"
                          ).innerHTML = "Enter your email address";
                          error = 1;
                        } else {
                          let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
                          if (!regex.test(emailDel.toLowerCase())) {
                            document.getElementById(
                              "your-email-error-message"
                            ).innerHTML = "Enter a valid email";
                            error = 1;
                          } else {
                            document.getElementById(
                              "your-email-error-message"
                            ).innerHTML = "";
                          }
                        }
                      } else {
                        setEmailDel("");
                      }
                      if (document.getElementById("postal-del").checked) {
                        if (!address) {
                          document.getElementById(
                            "your-postal-error-message"
                          ).innerHTML = "Enter your postal address";
                          error = 1;
                        } else {
                          document.getElementById(
                            "your-postal-error-message"
                          ).innerHTML = "";
                        }
                      } else {
                        setAddress("");
                      }
                      if (semwiseMap === true) {
                        if (
                          !(
                            document.getElementById("check_s1").checked ||
                            document.getElementById("check_s2").checked ||
                            document.getElementById("check_s3").checked ||
                            document.getElementById("check_s4").checked ||
                            document.getElementById("check_s5").checked ||
                            document.getElementById("check_s6").checked ||
                            document.getElementById("check_s7").checked ||
                            document.getElementById("check_s8").checked ||
                            document.getElementById("check_s9").checked ||
                            document.getElementById("check_s10").checked
                          )
                        ) {
                          document.getElementById(
                            "select-semester-error-message"
                          ).innerHTML = "Select a semester";
                          error = 1;
                        } else {
                          document.getElementById(
                            "select-semester-error-message"
                          ).innerHTML = "";
                        }

                        SemObj.forEach((obj) => {
                          obj.copies = 0;
                        });
                        setSemester(SemObj);
                        let copyInputNodes = document.querySelectorAll(
                          ".copies-input"
                        );
                        copyInputNodes.forEach((node) => {
                          if (node.value > 0)
                            setCopies(parseInt(node.id.slice(14)), node.value);
                          else {
                            document.getElementById(
                              "rc-gc-no-of-copies-error-message"
                            ).innerHTML = "Enter valid no. of copies";
                            error = 1;
                          }
                        });
                      }
                    } else if (
                      store.getState().file === "course re-registration" ||
                      store.getState().file === "course de-registration"
                    ) {
                      if (!store.getState().emailCount) {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "Add email addresses";
                        error = 1;
                      } else {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "";
                      }
                      if (!store.getState().courseCode) {
                        document.getElementById(
                          "ccode-error-message"
                        ).innerHTML = "Enter your course code";
                      }
                      if (!store.getState().course) {
                        document.getElementById(
                          "cname-error-message"
                        ).innerHTML = "Enter your course name";
                      }
                    }
                    if (error === 0) {
                      setModal(true);
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <Modal
            show={showModal}
            onHide={handleSubmitClose}
            keyboard={false}
            dialogClassName="approveModal"
            aria-labelledby="contained-modal-title-vcenter"
            className="certModal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Submit Request - final
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {isLoading ? (
                <Loader
                  className="text-center"
                  type="Audio"
                  color="rgb(13, 19, 41)"
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              ) : (
                <>
                  <h5 className="text-center">
                    <strong>Confirm the order of approval:</strong>
                  </h5>
                  <br />
                  <ul className="modal-pop list-group text-center">
                    <li className="modal-pop list-group-item">
                      {user + "@nitt.edu"}
                    </li>
                    {store.getState().emails.map((email, index) => {
                      return (
                        <li key={index} className="modal-pop list-group-item">
                          <div className="d-block text-center">
                            <img
                              src="down.svg"
                              alt="Down arrow"
                              height="60"
                              width="30"
                            />
                          </div>
                          {email}
                        </li>
                      );
                    })}
                  </ul>
                  <br />
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={certificateRequest}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </Modal.Body>
          </Modal>
          <div className="col-md-6  cert-right d-flex justify-content-center">
            <ul className="list-group emailList">
              {store.getState().emails.length > 0 ? (
                <li className="list-group-item">{user + "@nitt.edu"}</li>
              ) : (
                <></>
              )}
              {store.getState().emails.map((email, index) => {
                return (
                  <div key={index}>
                    <div className="d-block text-center">
                      <img
                        src="down.svg"
                        alt="Down arrow"
                        height="60"
                        width="30"
                      />
                    </div>
                    {/* </div> */}
                    <li key={index} className="list-group-item gray">
                      {email}
                      {store.getState().file !== "transcript" &&
                      store.getState().file !== "rank card" &&
                      store.getState().file !== "grade card" ? (
                        <button
                          className="btn btn-del"
                          onClick={(e) => {
                            e.preventDefault();
                            store.dispatch(
                              setEmailCount(store.getState().emailCount - 1)
                            );
                            store.getState().emails.splice(index, 1);
                            store.dispatch(setEmails(store.getState().emails));
                          }}
                        >
                          <span>&#127335;</span>
                        </button>
                      ) : (
                        <></>
                      )}
                    </li>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ID and certificate Modal*/}
        <FilesModal fileModal={fileModal} handleClose={handleClose}>
          {" "}
        </FilesModal>

        <InstructionsModal
          //show={store.getState().instructionsModal}
          hide={handleInstructionsClose}
          centered
        ></InstructionsModal>

        <SignatoriesInstructionsModal
          //show={signatoriesModal}
          hide={handleSignatoriesClose}
          centered
        ></SignatoriesInstructionsModal>
      </div>
    </>
  );
}

export default Upload;
