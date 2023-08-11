import InputDialog from "../ui/Dialogs/InputDialog";
import { signupDialog } from "../ui/dialogStructures/authDialogs";
import { setState } from "../main";
import { baseURL } from "../constants";
import axios from "axios";

//State
const userData = {};

const handleSubmit = (dialog, game) => {
	axios
		.post("/signup", userData)
		.then((res) => {
			const jwt = res.data.jwt;
			const user = { ...res.data, jwt: undefined, bag: ["LoginKey"] };
			setState(user);
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("JWT", jwt);
			//close dialog
			dialog.closeAlert();
			game.dialog.closeAlert();
		})
		.catch((e) => {
			console.log(e);
		});
	// game.player.setTexture(userData.name, "front-walk.000");
};

const handleSignup = (game) => {
	const signupDialogBox = new InputDialog(
		/*DataObject:    */ userData,
		/*DialogObject:  */ signupDialog,
		/*SpriteImage:   */ `${baseURL}/thumbnails/bald_blue_boy.png`,
		/*openState:     */ false,
		/*forceRemove:   */ false,
		/*SubmitHandler: */ (dialog) => handleSubmit(dialog, game)
	);
	signupDialogBox.show();
};

export default handleSignup;
