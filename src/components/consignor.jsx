import React, { useEffect, useState, useRef } from "react";
import SideNavbar from "../sideNavbar.jsx";
import {
  Select,
  Modal,
  Form,
  Input,
  Button,
  notification,
  Table,
  Drawer,
  Skeleton,
} from "antd";
import axios from "axios";
import { get } from "lodash";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useDownloadExcel } from "react-export-table-to-excel";

function Consignor() {
  const [consignors, setConsignors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [updateId, setUpdateId] = useState("");
  const [searched, setSearched] = useState([]);
  const tableRef = useRef(null);
  const [loading,setLoading]=useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/api/consignor?search=${searched}`
      );
      setConsignors(get(result, "data.message"));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  };



  useEffect(() => {
    fetchData();
  }, [searched]);


  console.log(searched)

  const handleClear = () => {
    form.setFieldsValue([]);
  };

  const handleSubmit = async (value) => {
    if (updateId === "") {
      try {
        await axios.post(`${process.env.REACT_APP_URL}/api/consignor`, value);
        fetchData();
        notification.success({ message: "Consignor Added successfully" });
        setOpen(false);
        form.setFieldValue([]);
      } catch (err) {
        notification.error({ message: "Something went wrong" });
      }
    } else {
      try {
        await axios.put(
          `${process.env.REACT_APP_URL}/api/consignor/${updateId}`,
          value
        );
        fetchData();
        notification.success({ message: "Consignor updated successfully" });
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

  const handleDelete = async (value) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/consignor/${value._id}`);
      fetchData();
      notification.success({ message: "Deleted Successfully" });
    } catch (err) {
      notification.error({ message: "Something Went Wrong" });
    }
  };

 
  const searchers = [];

  consignors &&
    consignors.map((data) => {
      return searchers.push(
        {label: data.name, value: data.name },
        { label: data.phone,value: data.phone },
        { label: data.place,value: data.place }
      );
    }).flat();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Web Users",
    sheet: "Web Users",
  });

  const columns = [
    {
      title: <h1 className="!text-[18px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },

    {
      title: <h1 className="!text-[18px]">Address</h1>,
      dataIndex: "address",
      key: "address",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: <h1 className="!text-[18px]">Place</h1>,
      dataIndex: "place",
      key: "place",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: <h1 className="!text-[18px] !w-[10vw]">Contact Person</h1>,
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: <h1 className="!text-[18px]">Phone</h1>,
      dataIndex: "phone",
      key: "phone",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: <h1 className="!text-[18px]">GST NO</h1>,
      dataIndex: "gstno",
      key: "gstno",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },
    {
      title: <h1 className="!text-[18px]">Mail ID</h1>,
      dataIndex: "mail",
      key: "mail",
      render: (text) => <div className="!text-[16px]">{text}</div>,
    },

    {
      title: <h1 className="text-[18px]">Actions</h1>,
      render: (text) => (
        <div className="flex gap-1">
          <div>
            <EditNoteOutlinedIcon
              className="!text-md !text-[--secondary-color] cursor-pointer"
              onClick={() => handleEdit(text)}
            />
          </div>

          <div>
            <DeleteOutlineOutlinedIcon
              className="!text-md !text-[--secondary-color] cursor-pointer "
              onClick={() => {
                handleDelete(text);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex pt-[12vh] pl-4">
      <div className="w-[82vw] flex flex-col gap-8">
        <div className="flex items-center justify-center">
          <Select
            mode="tags"
            showSearch
            placeholder="Type here for Consginer"
            options={searchers}
            onChange={(data) => {
              setSearched(data);
            }}
            className="w-1/2 !m-auto py-3"
            size="large"
            showArrow={false}
            // open={searched.length===1?false:true}
          />
        </div>
        <div className="w-full flex justify-end items-end gap-5">
          <div
            className="float-right w-[120px] py-1 rounded-md cursor-pointer text-white font-bold  flex items-center justify-center bg-[--secondary-color]"
            onClick={() => {
              setOpen(true);
            }}
          >
            <AddOutlinedIcon /> Create
          </div>
          <div>
            <Button
              onClick={onDownload}
              className="w-[120px] py-1  rounded-md cursor-pointer text-white font-bold  flex items-center justify-center bg-[--secondary-color] hover:!text-white"
            >
              Export Exel
            </Button>
          </div>
        </div>
        <Skeleton loading={loading}>
          <Table
            columns={columns}
            dataSource={consignors}
            ref={tableRef}
            pagination={{
              pageSize: 5,
            }}
         
          />
        </Skeleton>
      </div>
      <Drawer
        open={open}
        width={500}
        destroyOnClose
        onCancel={() => {
          setOpen(!open);
          form.setFieldValue([]);
          setUpdateId("");
        }}
        onClose={() => {
          setOpen(!open);
          form.setFieldValue([]);
          setUpdateId("");
        }}
        className="!bg-[--primary-color] !text-blue-500"
        title={<h1 className="text-lg">Consignor</h1>}
      >
        <Form
          className="flex flex-col"
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
            <Input type="number" size="large" />
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

          <div className="flex gap-4 items-end justify-end">
            <Form.Item>
              <Button
                htmlType="submit"
                className="bg-red-500 w-[130px] !cursor-pointer float-right text-white font-bold tracking-wider"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                className="bg-green-600 w-[120px] float-right text-white font-bold tracking-wider"
              >
                {updateId === "" ? "Save" : "Update"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}

export default Consignor;
