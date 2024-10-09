import { auth } from "@service";
import { LockOutlined ,UserAddOutlined,UserOutlined,MailOutlined   } from "@ant-design/icons";
import { Button, Form, Input, notification, Select } from "antd";
import erplogo from "../../assets/erplogo.jpg";
import { useNavigate } from 'react-router-dom';
import { Sign_Up } from "@types";

const SignUp = () => {
  const navigate = useNavigate();
  const { Option } = Select;
  const [form] = Form.useForm();

  
  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email :"",
    password: "",

  };

  const handleSubmit = async (values: Sign_Up) => {
    try {
      const response = await auth.sign_up(values);  
  
      if (response.status === 200 || response.status === 201) {
        const access_token = response?.data?.data?.tokens?.access_token;
        console.log("Access_token", access_token);
        localStorage.setItem("access_token", access_token);
  
        notification.success({
          message: 'Sign Up Successfully',
          description: 'You have successfully signed up.',
        });
  
        navigate("/admin-layout");
      } else {
        notification.error({
          message: 'Sign Up Failed',
          description: 'An error occurred during sign-up.',
        });
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      notification.error({
        message: 'Sign Up Error',
        description: 'There was an error processing your sign-up request.',
      });
    }
  };
  

  
  const onFinish = (values: any) => {
    // Combine prefix and phone number
    const combinedPhoneNumber = `${values.prefix}${values.phone_number}`;
  
    
    const updatedValues = {
      first_name:values.first_name,
      last_name:values.last_name,
      email:values.email,
      phone_number: combinedPhoneNumber, 
      password: values.password, 
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
                name="first_name"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-[24px] text-[grey]" />}
                  type="text"
                  placeholder="First name"
                  className="w-full h-[55px]"
                />
              </Form.Item>
              <Form.Item
                name="last_name"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input
                  prefix={<UserAddOutlined className="text-[24px] text-[grey]" />}
                  type="text"
                  placeholder="Last name"
                  className="w-full h-[55px]"
                />
              </Form.Item>
              <Form.Item
               name="email"  
                  rules={[
               { required: true, message: "Please input your email!" },
                   ]}
                  >
                    <Input
                     prefix={<MailOutlined className="text-[24px] text-[grey]" />}
                     type="text"
                     placeholder="Email"
                     className="w-full h-[55px]"
                   />
                  </Form.Item>

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
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
