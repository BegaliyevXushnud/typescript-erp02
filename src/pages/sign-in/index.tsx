import { auth } from "@service";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Select } from "antd";
import erplogo from "../../assets/erplogo.jpg";
import { useNavigate } from 'react-router-dom';
import { Sign_In } from "@types";

const Login = () => {
  const navigate = useNavigate();
  const { Option } = Select;
  const [form] = Form.useForm();

  
  const initialValues = {
    phone_number: "",
    password: "",
  };

  const handleSubmit = async (values: Sign_In) => {
    try {
      const response = await auth.sign_in(values);

      if (response.status === 200 || response.status === 201) {
        const access_token = response?.data?.data?.tokens?.access_token;
        console.log("Access_token", access_token);
        localStorage.setItem("access_token", access_token);

        notification.success({
          message: 'Login Successfully',
          description: 'You have successfully logged in.',
        });

        navigate("/admin-layout");
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'An error occurred during login.',
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      notification.error({
        message: 'Login Error',
        description: 'There was an error processing your login request.',
      });
    }
  };

  
  const onFinish = (values: any) => {
    const combinedPhoneNumber = `${values.prefix}${values.phone_number}`;

    const updatedValues = {
      phone_number: combinedPhoneNumber, // Combined phone number
      password: values.password, // Keep password unchanged
    };
  
    console.log("Final Payload:", updatedValues);
    handleSubmit(updatedValues); // Send updated values without 'prefix'
  };
  
  // Phone number prefix selector
  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="+998">
      <Select style={{ width: 100 }}>
        <Option value="+998">+998</Option>
        <Option value="+999">+7</Option>
        <Option value="+996">+1</Option>
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
              initialValues={initialValues}
              onFinish={onFinish}
              className="flex flex-col gap-3"
            >
              <Form.Item
                name="phone_number"
                rules={[
                  { required: true, message: "Please input your phone number!" },
                  
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  placeholder="Phone Number"
                />
              </Form.Item>

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
                  >
                    Log in
                  </Button>
                )}
              </Form.Item>
             <button onClick={() => navigate('sign-up')}>Register now</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
