import axios from "axios";
import ContentAdmin from "../components/ContentAdmin";
import { FormEvent, useEffect, useState } from "react";
import { Messages as MessagesModel, UserProps } from "../../types";
import getMainUrlApi from "../../utils/getMainUrlApi";
import { Avatar } from "flowbite-react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import saveVisite from "../../utils/saveVisiteSite";

const Messages = () => {
	// user list
	const [users, setUsers] = useState<Array<UserProps>>([]);
	axios.defaults.withCredentials = true;
	localStorage.setItem("page", "Messagerie");
	const user = useSelector((state: RootState) => state.user);
	window.document.title = "Messagerie";

	const [messages, setMessages] = useState<Array<MessagesModel>>([]);
	const [selectUser, setselectUser] = useState<number | null | undefined>(
		null
	);
	const [msg, setMsg] = useState<string | null>(null);

	// recuperationdes utilisateurs clients
	useEffect(() => {
		axios
			.get(`${getMainUrlApi()}users/user`)
			.then((data) => {
				setUsers(data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// recuperation des messages selon l'utiloisateuir connecte et l'utiisateur selectionner
	const getMessageUserConnectedUserSend = (
		me: number | null | undefined,
		userSend: number | null | undefined
	) => {
		axios
			.get(`${getMainUrlApi()}messages/${me}/${userSend}`)
			.then((data) => {
				setMessages(data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const sendMessageChat = async (e: FormEvent) => {
		e.preventDefault();
		const data = {
			fromUserId: user?.id,
			toUserId: selectUser,
			message: msg,
		};

		await axios
			.post(`${getMainUrlApi()}messages`, data)
			.then((res) => {
				console.log(res);
				setMsg("");
				getMessageUserConnectedUserSend(user?.id, selectUser);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		return () => {
			saveVisite(window.document.title);
		};
	}, []);

	return (
		<ContentAdmin>
			<ToastContainer />
			<div className="p-0 sm:ml-64_ m-0 w-full">
				<div className="p-4 border- h-[90vh] min-h-[90vh] rounded dark:border-gray-700 m-0 mt-2">
					<div className="w-full mx-auto m-0 h-[90vh] min-h-[90vh] p-0">
						<div className="min-w-full w-full max-w-full border rounded lg:grid lg:grid-cols-3">
							{/* contact */}
							<div
								className={`border-r border-gray-300 lg:col-span-1 ${
									selectUser ? "hidden lg:block" : "w-full"
								}`}
							>
								<div className="mx-3 my-3">
									{/* search form contact */}
									<div className="relative text-gray-600">
										<span className="absolute inset-y-0 left-0 flex items-center pl-2">
											<svg
												fill="none"
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												viewBox="0 0 24 24"
												className="w-6 h-6 text-gray-300"
											>
												<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
											</svg>
										</span>
										<input
											type="search"
											className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
											name="search"
											placeholder="Search"
											required
										/>
									</div>
								</div>
								{/* contact list */}
								<ul className="overflow-auto h-[60vh]">
									<h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">
										Chats
									</h2>
									{users.map((users) => (
										<li key={users.id}>
											<a
												href="#"
												className={`flex items-center px-2 py-1 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer ${
													selectUser === users.id
														? "bg-slate-200"
														: "hover:bg-gray-100 focus:outline-none"
												} `}
												onClick={() => {
													setselectUser(users.id);
													getMessageUserConnectedUserSend(
														user?.id,
														users.id
													);
												}}
											>
												<Avatar
													className="border-gray-100"
													rounded
													status="online"
												/>
												<div className="w-full pb-2">
													<div className="flex justify-between">
														<span className="block ml-2 font-semibold text-gray-600">
															{users.pseudo}
														</span>
														<span className="block ml-2 text-sm text-gray-600">
															{users.created_at}
														</span>
													</div>
													<span className="block ml-2 text-sm text-gray-600">
														{users?.email}
													</span>
												</div>
											</a>
										</li>
									))}
								</ul>
							</div>

							{/* Messages */}
							<div
								className={`${
									!selectUser
										? "w-full col-span-12 sm:hidden lg:block md:block"
										: "w-full col-span-12"
								} lg:col-span-2 lg:block`}
							>
								<div className="w-ful">
									<div className="flex flex-row-reverse justify-between items-center p-3 border-b border-gray-300">
										<button
											className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md lg:hidden md:hidden"
											onClick={() => {
												setselectUser(null);
											}}
										>
											Retour
										</button>

										<div className="relative flex items-center justify-start">
											<Avatar rounded />
											<span className="block ml-2 font-bold text-gray-600">
												{`${user?.pseudo} <${user?.email}>`}
											</span>
											<span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 -top-1"></span>
										</div>
									</div>
									{/* messages */}
									<div className="relative w-full p-6 overflow-y-auto h-[60vh]">
										<ul className="space-y-2">
											{selectUser &&
												messages.map((messages) => (
													<li
														key={messages.id}
														className={`${
															messages.fromUserId ===
															user?.id
																? "flex justify-start bg-blue-200/10"
																: "flex justify-end bg-green-200/10"
														}`}
													>
														<div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow_">
															<span className="block">
																{
																	messages.message
																}
															</span>
														</div>
														{/* <span className="italic">
															{new Date(messages.sentAt).toLocaleString()}
														</span> */}
													</li>
												))}
										</ul>
									</div>
									{/* formulaire d'envoi */}
									<div className="p-0 m-0">
										<form
											action="#"
											onSubmit={sendMessageChat}
											className="flex items-center justify-between w-full py-2 pr-2 border-t border-gray-300"
										>
											<input
												type="text"
												placeholder="Message"
												className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
												name="message"
												required
												value={msg ?? ""}
												onChange={(e) => {
													setMsg(e.target.value);
												}}
											/>
											<button type="submit">
												<svg
													className="w-6 h-6 text-gray-500 hover:bg-slate-50 origin-center transform rotate-90"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
												</svg>
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ContentAdmin>
	);
};

export default Messages;
