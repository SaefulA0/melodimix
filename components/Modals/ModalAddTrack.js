import { Fragment, useState } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { MdOutlinePlaylistAdd } from "react-icons/md";

import AlertFail from "../Alerts/AlertFail";

export default function ModalAddTrack({ idsong, playlist, spotifyAPI }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [message, setMessage] = useState("");

  let [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const successToast = () =>
    toast("Musik berhasil ditambah", {
      hideProgressBar: false,
      autoClose: 2000,
      type: "success",
      position: "bottom-left",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });

  const failToast = () =>
    toast("Musik gagal ditambah", {
      hideProgressBar: false,
      autoClose: 2000,
      type: "error",
      position: "bottom-left",
      closeOnClick: true,
      draggable: true,
      theme: "light",
    });

  // ADD TRACK TO A PLAYLIST
  const handleAddTrack = () => {
    if (spotifyAPI.getAccessToken()) {
      spotifyAPI
        .addTracksToPlaylist(`${selectedPlaylist}`, [`spotify:track:${idsong}`])
        .then((data) => {
          successToast();
          closeModal();
        })
        .catch((err) => {
          setMessage(
            "Pastikan daftar putar yang kamu pilih adalah daftar putar yang kamu buat sendiri."
          );
          failToast();
        });
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex gap-1 text-gray-700 items-center cursor-pointer text-sm px-2 py-3 hover:bg-gray-400 hover:bg-opacity-20 rounded-md"
      >
        <MdOutlinePlaylistAdd size={24} />
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <RadioGroup
                    value={selectedPlaylist}
                    onChange={setSelectedPlaylist}
                  >
                    <RadioGroup.Label
                      as="h3"
                      className="text-lg font-bold leading-6 text-gray-900 mb-7"
                    >
                      Simpan Ke Dalam Daftar Putar
                    </RadioGroup.Label>
                    {/* ALERT */}
                    {message ? <AlertFail message={message} /> : null}
                    {playlist?.items >= 0 ? (
                      <>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          <div className="p-5 text-gray-800 text-sm md:text-base flex justify-center items-center w-full h-20 border text-center bg-white shadow-lg rounded-lg">
                            Oops sepertinya kamu masih belum memiliki daftar
                            putar musik.
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* LIST PLAYLISTS */}
                        {playlist?.items?.map((playlist, i) => (
                          <RadioGroup.Option
                            key={playlist.id}
                            value={playlist.id}
                            className={({ active, chacked }) =>
                              `${
                                active
                                  ? "ring-2 ring-white/60 ring-offset-2 ring-offset-gray-300 bg-gray-200"
                                  : ""
                              } 
                        relative flex cursor-pointer rounded-lg focus:outline-none hover:bg-gray-300 delay-100 bg-transparent duration-300 mb-1
                        `
                            }
                          >
                            {({ active, chacked }) => (
                              <div className="flex justify-start items-center text-left w-full p-2 rounded-md ">
                                {playlist.images?.[0] ? (
                                  <img
                                    src={playlist.images?.[0]?.url}
                                    className="rounded-md aspect-square object-cover w-16 mb-1 mr-3"
                                    width={64}
                                    height={64}
                                    alt="Album Img"
                                  />
                                ) : (
                                  <img
                                    className="rounded-md aspect-square object-cover w-16 mb-1 mr-3"
                                    src="/imgs/albumCover.png"
                                    width={64}
                                    height={64}
                                    alt="Album Image"
                                  />
                                )}
                                <div>
                                  <RadioGroup.Label
                                    as="p"
                                    className={`text-base font-semibold truncate ${
                                      chacked ? "text-white" : "text-gray-800"
                                    } mb-1`}
                                  >
                                    {playlist.name}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`text-sm font-normal ${
                                      chacked ? "text-sky-100" : "text-gray-800"
                                    } text-opacity-50 line-clamp-1 mb-2`}
                                  >
                                    {playlist.description}
                                  </RadioGroup.Description>
                                </div>
                              </div>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </>
                    )}
                  </RadioGroup>
                  <div className="w-full flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      className="w-28 inline-flex justify-center rounded-md shadow-md border-2 border-gray-800 border-opacity-50 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-300 focus:outline-none"
                      onClick={closeModal}
                    >
                      Tutup
                    </button>
                    {selectedPlaylist ? (
                      <button
                        onClick={handleAddTrack}
                        className="w-28 inline-flex justify-center rounded-md shadow-md border border-gray-900 bg-gradient-to-tl from-gray-700 via-[#252525] to-gray-800 px-4 py-2 text-sm font-medium text-slate-100 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-300 focus:outline-none"
                      >
                        Tambah
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-28 inline-flex justify-center rounded-md shadow-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-500 opacity-80"
                      >
                        Tambah
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
