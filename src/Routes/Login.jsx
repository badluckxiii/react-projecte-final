import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../Hooks/useTitle";
const Login = ({title}) => {
	const [ErrorMessage, setErrorMessage] = useState('');
	useTitle(title)
	const navigate = useNavigate();
	const onSubmit = (e) => {
		e.preventDefault();
		const objecteDadesLogin = {
			email: e.target[0].value,
			password: e.target[1].value,
		};
		const result = login(objecteDadesLogin);
		result
			.then((result) => {
				console.log(result);
				if (result?.Title) {
					if (result.Title === "Login incocorrecte") {
						setErrorMessage("Error dades incorrectes");
					} else {
						console.log(result);
						const token={
							id: result.id,
							email: result.email,
							token: result.token,
						}
						localStorage.setItem(
							"token",
							JSON.stringify(token)
						);
							// window.location.href="/perfil";
							// window.location.href='/perfil';
							// navigate("/");
							navigate(0);
					}

				}
			})
			.catch((err) => { });
	};
	const login = async (objecte) => {
		let headersList = {
			"Accept": "*/*",
			"User-Agent": "Thunder Client (https://www.thunderclient.com)",
			"Content-Type": "application/json",
		};

		console.log(objecte);
		let bodyContent = JSON.stringify({
			email: objecte.email,
			password: objecte.password,
		});

		let response = await fetch("http://vos.es/api/login", {
			method: "POST",
			body: bodyContent,
			headers: headersList,
		});

		let data = await response.json();
		return data;
	};
	return (
		<div className="row">
			<div className="col-2"></div>
			<div className="col-8">
				<form
					action=""
					onSubmit={(e) => {
						onSubmit(e);
					}}
					method="post"
				>
					<div className="mb-3">
						<label htmlFor="usuari">Usuari</label>
						<input id="usuari" className="form-control" type="text" />
					</div>
					<div className="mb-3">
						<label htmlFor="contrasenya">Contrasenya</label>
						<input id="contrasenya" className="form-control" type="password" />
					</div>
					<div className="d-flex justify-content-center">
						<input type="submit" className="btn btn-primary" value="Login" />
					</div>
					<small className="text-danger">{ErrorMessage}</small>
				</form>
				<div className="mt-50vh"></div>
			</div>
			<div className="col-2"></div>
		</div>
	);
};

export default Login;
