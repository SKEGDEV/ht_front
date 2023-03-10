import styles from "./login.module.scss";
import Input from "../../components/input/input.jsx";
import Button from "../../components/button/button.jsx";
import logo_1 from "../../img/logo_1.png";
import { useState } from "react";
import facebook_icon from "../../img/facebook_icon.svg";
import instagram_icon from "../../img/instagram_icon.svg";
import whatsapp_icon from "../../img/whatsapp_icon.svg";

export default function Login() {
	const [form_no, setForm_no] = useState(styles.first);

	const change_form = (form_No) => {
		if (form_No === 1) {
			setForm_no(styles.first);
			return;
		}
		if (form_No === 2) {
			setForm_no(styles.second);
			return;
		}
		setForm_no(styles.third);
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.left_slider}>
				<div className={styles.slider_form + " " + form_no}>
					<div className={styles.form}>
						<img src={logo_1} />
						<div className={styles.input_container}>
							<Input
								lblText="Nombre de usuario"
								placeholder="Ingrese su nombre de usuario"
								type="text"
							/>
							<Input
								lblText="Contraseña"
								placeholder="Ingrese su contraseña"
								type="password"
							/>
						</div>
						<div className={styles.btn_container}>
							<Button
								text="Crear cuenta"
								press_btn={() => {
									change_form(2);
								}}
							/>
							<Button text="Iniciar sesion" type="success" />
						</div>
						<div className={styles.restore}>
							<a href="#">Olvido su contraseña?</a>
						</div>
					</div>
					<div className={styles.form}>
						<br />
						<h1>Informacion personal</h1>
						<br />
						<div className={styles.input_container}>
							<Input
								lblText="Nombres"
								placeholder="Ingrese su/sus nombre/s"
								type="text"
							/>
							<Input
								lblText="Apellidos"
								placeholder="Ingrese sus apellidos"
								type="text"
							/>
							<Input
								lblText="Nacimiento"
								placeholder="Ingrese su fecha de nacimiento"
								type="date"
							/>
							<Input
								lblText="Documento ID"
								placeholder="Ingrese su numero de DPI/NIT"
								type="text"
							/>
						</div>
						<div className={styles.btn_container}>
							<Button
								text="Cancelar"
								type="danger"
								press_btn={() => {
									change_form(1);
								}}
							/>
							<Button
								text="Siguiente"
								type="success"
								press_btn={() => {
									change_form(3);
								}}
							/>
						</div>
					</div>
					<div className={styles.form}>
						<br />
						<h1>Contacto y sesion</h1>
						<br />

						<div className={styles.input_container}>
							<Input
								lblText="Email"
								placeholder="Ingrese su direccion de correo electronico"
								type="email"
							/>
							<Input
								lblText="Telefono"
								placeholder="Ingrese su numero telefonico"
								type="number"
							/>
							<Input
								lblText="Nombre usuario"
								placeholder="Ingrese su nombre de usuario"
								type="text"
							/>
							<Input
								lblText="Contraseña"
								placeholder="Ingrese su contraseña"
								type="password"
							/>
							<Input
								lblText="Confirmar contraseña"
								placeholder="Por favor confirme su contraseña"
								type="password"
							/>
						</div>
						<div className={styles.btn_container}>
							<Button
								text="Regresar"
								type="danger"
								press_btn={() => {
									change_form(2);
								}}
							/>
							<Button text="Crear Cuenta" type="success" />
						</div>
					</div>
				</div>
			</div>
			<div className={styles.right_slider}>
				<div className={styles.slider}>
					<div className={styles.section}>
						<h2>Que es Happy Teacher?</h2>
						<p>
							Happy teacher es una aplicacion de apoyo para maestros con el
							objetivo de reducir el tiempo de trabajo considerablemente,
							realizando operaciones cotidianas como las actividades educativas
							del dia a dia y llevando el control de estas mismas
						</p>
					</div>
					<div className={styles.section}>
						<h2>Beneficios</h2>
						<p>
							<ul>
								<li>Almacenar listados de estudiantes</li>
								<li>Crear actividades como examenes y tareas</li>
								<li>facilidad para calificar las mismas</li>
								<li>
									Generar boletas de calificaciones y cuadros de apreciacion con
									un solo click
								</li>
								<li>Y mucho mas...</li>
							</ul>
						</p>
					</div>
					<div className={styles.section}>
						<h2>Como empezar?</h2>
						<p>
							Puede empezar con un click en crear cuenta y llenar el formulario
							o si ya posee una cuenta ingresando su usuario y contraseña,
							clickeando en el boton de iniciar sesion, Happy Teacher sera un
							compañero eficiente de trabajo que le facilitara la vida asi
							que... Que espera? :)
						</p>
					</div>
					<div className={styles.section}>
						<h2>Contacto</h2>
						<p>
							Puede contactarme por cualquier duda en los enlaces adjuntos de
							mis redes sociales, estoy para servirle!! :)
						</p>
						<div className={styles.contact_container}>
							<img src={facebook_icon} alt="not found" />
							<img src={instagram_icon} alt="not found" />
							<img src={whatsapp_icon} alt="not found" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
