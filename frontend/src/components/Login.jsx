import React, { useState, useEffect, useCallback } from "react";
import { VStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import $ from "jquery";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      try {
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          { withCredentials: true }
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chat");
      } catch (e) {
        console.log(e);
        toast({
          title: "Invalid Credentials",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    },
    [email, password, toast, navigate]
  );
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        submitHandler(e);
      }
    };

    $(document).on("keydown", handleKeyDown);

    return () => {
      $(document).off("keydown", handleKeyDown);
    };
  }, [submitHandler]);
  function handleSetShow() {
    setShow(!show);
  }
  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function handleSetPassword(e) {
    setPassword(e.target.value);
  }

  return (
    <VStack spacing="5px" maxH="100vh">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          onChange={handleSetEmail}
          type="email"
          placeholder="Enter your Email"
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            onChange={handleSetPassword}
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleSetShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        onClick={submitHandler}
        m={8}
        p={1.5}
        colorScheme="cyan"
        size="lg"
        w="100%"
      >
        <Text fontSize="xl">Login</Text>
      </Button>
      <Button
        colorScheme="red"
        w="100%"
        size="lg"
        onClick={() => {
          setEmail("guest123@gmail.com");
          setPassword("guest123");
        }}
      >
        <Text fontSize="xl">Get Guest User Credentials</Text>
      </Button>
    </VStack>
  );
}

export default Login;
