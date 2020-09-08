import React, { useEffect, useState } from "react";
import spider from "../utils/API";
import NavBar from "../student/navbar/navbar";
import { Approve, Reject, Upload, Download } from "./sub_buttons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";

function Admin() {
  const [certReq, setReq] = useState([]);
  const [isLoading, setLoad] = useState(true);
  const [certTypes, setTypes] = useState([]);

  useEffect(() => {
    spider
      .get("/api/student/certificate_types")
      .then((res) => {
        res.data.map((x) => {
          x.certificate_type_id = x.id;
          delete x.id;
        });
        setTypes(Object.assign(certTypes, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    spider
      .get("/api/admin")
      .then((res) => {
        let temp = [];
        res.data.forEach((cc) => {
          if (cc.status === "PENDING") temp = Object.assign([], res.data);
        });
        for (let i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        let merged = [];

        certTypes.forEach((typ) => {
          let tempType = {
            certificate_type_id: typ.certificate_type_id,
            certificates: [],
          };
          temp.map((c) => {
            if (c.certificate_type == typ.certificate_type_id) {
              delete c.certificate_type;
              tempType.certificates.push(c);
            }
          });
          merged.push(tempType);
        });
        setReq(Object.assign(certReq, merged));
        setLoad(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container-fluid admin">
      <NavBar screen={1} />
      <h2 className="text-center cert-upl-head">Admin Certificate Portal</h2>
      <br />
      {isLoading ? (
        <p>LOADING</p>
      ) : (
        certReq.map((cert, index) => {
          return (
            <div key={index}>
              <h4 className="text-center">
                Certificate Type: {cert.certificate_type_id}
              </h4>
              <table className="table cert-table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Roll No.</th>
                    {/* <th scope="col">Certificate Type</th> */}
                    <th scope="col">Status</th>
                    <th scope="col">Certificate file</th>
                    <th scope="col">Upload Certificate</th>
                    <th scope="col">Decision</th>
                  </tr>
                </thead>

                <tbody>
                  {cert.certificates.map((data, index) => {
                    return (
                      <tr key={index}>
                        <th>{data.id}</th>
                        <td>{data.applier_roll}</td>
                        {/* <td>{data.certificate_type}</td> */}
                        <th>{data.status}</th>
                        <td>
                          <Download
                            certId={data.certificate_id}
                            roll={data.applier_roll}
                            certType={data.certificate_type}
                          />
                        </td>
                        <td>
                          <Upload />
                        </td>
                        <td>
                          <Approve
                            certId={data.certificate_id}
                            status={data.status}
                          />{" "}
                          <Reject
                            certId={data.certificate_id}
                            roll={data.applier_roll}
                            status={data.status}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })
      )}
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
    </div>
  );
}

export default Admin;
