import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const sendOtp = async ({ name, email, password }) => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/send-signup-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			return true;
		} catch (error) {
			alert(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const verifyOtp = async ({ name, email, password, otp }) => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/verify-signup-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, otp }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			localStorage.setItem("service-user", JSON.stringify(data));
			setAuthUser(data);
			return true;
		} catch (error) {
			alert(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { loading, sendOtp, verifyOtp };
};
export default useSignup;
