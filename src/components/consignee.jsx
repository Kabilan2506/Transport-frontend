import React, { useEffect, useState,useRef } from "react";
import SideNavbar from "../sideNavbar.jsx";
import {
  Space,
  Table,
  Tag,
  Select,
  Modal,
  Form,
  Input,
  Button,
  notification,
  
} from "antd";
import axios from "axios";
import { get } from "lodash";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useDownloadExcel } from "react-export-table-to-excel";

function Consignee() {
  const [Consignee, setConsignee] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [updateId, setUpdateId] = useState("");
  const tableRef = useRef(null);
  const [searched, setSearched] = useState([]);

  const fetchData = async () => {
    try {
      const result = await axios.get(`http://localhost:4001/api/consignee?search=${searched}`);
      setConsignee(get(result, "data.message"));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searched]);

  console.log(Consignee,"hb")

  const handleSubmit = async (value) => {
    if (updateId === "") {
      try {
        await axios.post("http://localhost:4001/api/consignee", value);
        fetchData();
        notification.success({ message: "Consignee Added successfully" });
        setOpen(false);
      } catch (err) {
        notification.error({ message: "Something went wrong" });
      }
    } else {
      try {
        await axios.put(
          `http://localhost:4001/api/consignee/${updateId}`,
          value
        );
        fetchData();
        notification.success({ message: "Consignee updated successfully" });
        setOpen(false);
        form.setFieldValue([]);
        setUpdateId("");
      } catch (err) {
        notification.error({ message: "Something went wrong" });
      }
    }
  };

  const handleEdit = (value) => {
    form.setFieldsValue(value);
    setUpdateId(value._id);
    setOpen(true);
  };

  const handleDelete = async(value) => {
    try {
      await axios.delete(`http://localhost:4001/api/consignee/${value._id}`)
      fetchData()
      notification.success({message:"Deleted Successfully"})
    } catch (err) {
      notification.error({message:"Something Went Wrong"})
    }
  }

  const searchers = [];

  console.log(Consignee,"Erkhuubj")

  Consignee &&
  Consignee.map((data) => {
      return searchers.push(
        { value: data.name },
        { value: data.phone },
        { value: data.place }
      );
    });

  const { onDownload } = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: "Web Users",
		sheet: "Web Users",
  });
  
  const handleClear = () => {
    form.setFieldsValue([]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: "Place",
      dataIndex: "place",
      key: "place",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: "GST NO",
      dataIndex: "gstno",
      key: "gstno",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: "Mail ID",
      dataIndex: "mail",
      key: "mail",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: "Actions",
      render: (text) => (
        <div className="flex gap-1">
          <div>
            <EditNoteOutlinedIcon
              className="!text-md text-green-500 cursor-pointer"
              onClick={() => handleEdit(text)}
            />
          </div>

          <div>
            <DeleteOutlineOutlinedIcon className="!text-md text-green-500 cursor-pointer " onClick={()=>{handleDelete(text)}} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex pt-[15vh] pl-4">
      <div className="w-[75vw] flex flex-col gap-10">
        <div className="flex items-center justify-center">
        <Select
            mode="tags"
            showSearch
            placeholder="Type here for Category"
            options={searchers}
            onChange={(data) => {
              setSearched(data);
            }}
            className="w-[50%] !m-auto py-3"
            size="large"
            showArrow={false}
          />
        </div>
        <div className="w-full flex gap-5 items-end justify-end">
          <div
            className=" w-[120px] py-1 rounded-md cursor-pointer text-white font-bold  flex items-center justify-center bg-green-500"
            onClick={() => {
              setOpen(true);
            }}
          >
            <AddOutlinedIcon />
            Create
          </div>
          <div>
            <Button
              onClick={onDownload}
              className="w-[120px] py-1  rounded-md cursor-pointer text-white font-bold  flex items-center justify-center bg-green-500 hover:!text-white"
            >
              Export Exel
            </Button>
          </div>
        </div>
        <Table columns={columns} dataSource={Consignee}  ref={tableRef}/>
      </div>
      <Modal
        open={open}
        width={700}
        onCancel={() => {
          setOpen(!open);
          form.setFieldValue([]);
          setUpdateId("");
        }}
        footer={false}
      >
        <Form
          className="grid grid-cols-2 gap-4"
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
        >
          <Form.Item
            label={<p className="!text-[16px] font-semibold">Name</p>}
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label={<p className="!text-[16px] font-semibold">Address</p>}
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label={<p className="!text-[16px] font-semibold">Place</p>}
            name="place"
            rules={[
              {
                required: true,
                message: "Please input your place!",
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label={<p className="!text-[16px] font-semibold">Phone</p>}
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone!",
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label={<p className="!text-[16px] font-semibold">Contact Person</p>}
            name="contactPerson"
            rules={[
              {
                required: true,
                message: "Please input your contact person!",
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label={<p className="!text-[16px] font-semibold">GST NO</p>}
            name="gstno"
            rules={[
              {
                required: true,
                message: "Please input your gstno!",
              },
            ]}
          >
            <Input type="text" size="large" />
          </Form.Item>
          <Form.Item
            label={<p className="!text-[16px] font-semibold">Mail</p>}
            name="mail"
            rules={[
              {
                required: true,
                message: "Please input your mail!",
              },
            ]}
          >
            <Input type="mail" size="large" />
          </Form.Item>
         
          <div className="w-[40vw]">
          <div className="flex gap-4 items-end justify-end">
          <Form.Item>
              <Button
                htmlType="submit"
                className="bg-green-500 w-[130px] !cursor-pointer float-right text-white font-bold tracking-wider"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Form.Item>
         
          <Form.Item>
            <Button
              htmlType="submit"
              className="bg-green-500 w-[120px] float-right text-white font-bold tracking-wider"
            >
              {updateId === "" ? "Save" : "Update"}
            </Button>
          </Form.Item>
         </div>
        </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Consignee;