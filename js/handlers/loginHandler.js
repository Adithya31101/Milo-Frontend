import axios from "axios";
import InputDialog from "../ui/Dialogs/InputDialog";
import { loginDialog } from "../ui/dialogStructures/authDialogs";
import { setState, snackbar } from "../main";
import { baseURL } from "../constants";

//State
const userData = {};

const handleSubmit = (dialog, game) => {
	axios
		.post("/login", userData)
		.then((res) => {
			const jwt = res.data.jwt;
			const user = { ...res.data, jwt: undefined, bag: ["LoginKey"] };
			setState(user);
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("JWT", jwt);
			//close dialog
			snackbar.configure("Logged in successfully as " + user.name, "success");
			snackbar.show();
			dialog.closeAlert();
			game.dialog.closeAlert();
		})
		.catch((e) => {
			console.log(e);
			snackbar.configure("There was some error please try again.");
			snackbar.show();
		});
};

const handleLogin = (game) => {
	const loginDialogBox = new InputDialog(
		/*DataObject:    */ userData,
		/*DialogObject:  */ loginDialog,
		/*SpriteImage:   */ `${baseURL}/thumbnails/bald_blue_boy.png`,
		/*openState:     */ false,
		/*forceRemove:   */ false,
		/*SubmitHandler: */ (dialog) => handleSubmit(dialog, game)
	);
	loginDialogBox.show();
};

export default handleLogin;
