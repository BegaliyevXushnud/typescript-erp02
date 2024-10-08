import { auth } from "@service";
import { useEffect, useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import erplogo from "../../assets/erplogo.jpg";

const Login = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    const phoneNumber = `${values.prefix}${values.phone}`;
    try {
      await auth.sign_in({ phone_number: phoneNumber, password: values.password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = (values: any) => {
    console.log("Finish:", values);
    handleSubmit(values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="+998">
      <Select style={{ width: 100 }}>
        <Option value="+998">+998</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-[2440px] h-[100vh] bg-white shadow-lg">
        <div className="hidden w-1/2 h-full lg:block">
          <img src={erplogo} alt="erplogo" className="object-cover w-full h-full" />
        </div>
        <div className="flex flex-col items-center justify-center w-full px-4 lg:w-1/2 sm:px-6 lg:px-8">
          <div className="w-full max-w-[460px] flex flex-col gap-1">
            <h1 className="font-semibold text-[40px] mb-8">Login</h1>
            <Form
              form={form}
              name="horizontal_login"
              onFinish={onFinish}
              className="flex flex-col gap-3"
            >
              {/* Phone number field */}
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Please input your phone number!" },
                  { pattern: /^[0-9]{9}$/, message: "Please input a valid phone number!" }
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  placeholder="Phone Number"
                />
              </Form.Item>

              {/* Password field */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="text-[24px] text-[grey]" />}
                  type="password"
                  placeholder="Password"
                  className="w-full h-[55px]"
                />
              </Form.Item>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-40"
                    // disabled={
                    //   !clientReady ||
                    //   !form.isFieldsTouched(true) ||
                    //   form.getFieldsError().some(({ errors }) => errors.length)
                    // }
                    
                  >
                    Log in
                  </Button>
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
