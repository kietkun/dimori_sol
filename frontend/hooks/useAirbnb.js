import * as anchor from "@project-serum/anchor";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PROGRAM_PUBKEY } from "../constants";
import homeIDL from "../constants/airbnb.json";
import { SystemProgram } from "@solana/web3.js";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";

// Static data that reflects the todo struct of the solana program

export function useDimori() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const anchorWallet = useAnchorWallet();

    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState({});
    const [homes, setHomes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [lastHome, setLastHome] = useState(0);
    const [lastBookId, setLastBookId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [transactionPending, setTransactionPending] = useState(false);

    // const program = new PublicKey(
    //     "8ktkADKMec8BE1q47k6LnMWqYpNTjqtinZ6ng219wMwf"
    //   );

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(
                connection,
                anchorWallet,
                anchor.AnchorProvider.defaultOptions()
            );
            return new anchor.Program(homeIDL, PROGRAM_PUBKEY, provider);
        }
    }, [connection, anchorWallet]);

    useEffect(() => {
        const start = async () => {
            if (program && publicKey && !transactionPending) {
                try {
                    const [profilePda, profileBump] = await findProgramAddressSync(
                        [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                        program.programId
                    );
                    const profileAccount = await program.account.userProfile.fetch(
                        profilePda
                    );
                    console.log(profileAccount);
                    if (profileAccount) {
                        setLastHome(profileAccount.last);
                        setInitialized(true);
                        setLoading(true);

                        const listings = await program.account.userAccount.all();
                        const allBookings = await program.account.bookingAccount.all();
                        setUser(profileAccount.toString());
                        setHomes(listings);

                        const myBookings = allBookings.filter(
                            (booking) =>
                                booking.account.authority.toString() ==
                                profileAccount.authority.toString()
                        );

                        setBookings(myBookings);
                    } else {
                        setInitialized(false);
                    }
                } catch (error) {
                    console.log(error);
                    setInitialized(false);
                } finally {
                    setLoading(false);
                }
            }
        };

        start();
    }, [publicKey, program, transactionPending]);

    const initializeUser = async () => {
        if (program && publicKey) {
            try {
                setTransactionPending(true);
                setLoading(true);
                const [profilePda] = findProgramAddressSync(
                    [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                    program.programId
                );

                const tx = await program.methods
                    .initializeUser()
                    .accounts({
                        userProfile: profilePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                setInitialized(true);
                toast.success("Successfully initialized user.");
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };

    const addHome = async ({
        address,
        longtitude,
        latitude,
        location,
        image,
        theme,
        price,
    }) => {
        console.log(
            address,
            longtitude,
            latitude,
            location,
            image,
            theme,
            price,
            "YOOO"
        );
        if (program && publicKey) {
            setTransactionPending(true);
            setLoading(true);
            try {
                const [profilePda] = findProgramAddressSync(
                    [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                    program.programId
                );
                const [homePda] = findProgramAddressSync(
                    [
                        utf8.encode("INFO_STATE"),
                        publicKey.toBuffer(),
                        Uint8Array.from([lastHome]),
                    ],
                    program.programId
                );

                console.log(
                    publicKey.toString(),
                    program.programId,
                    profilePda.toString(),
                    homePda.toString(),
                    lastHome
                );

                await program.methods
                    .addHome(
                        address,
                        longtitude,
                        latitude,
                        location,
                        image,
                        theme,
                        price,
                    )
                    .accounts({
                        userProfile: profilePda,
                        userAccount: homePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                toast.success("SUCCESSFULLY ADDED A LISTING");
            } catch (error) {
                console.error(error);
            } finally {
                setTransactionPending(false);
                setLoading(false);
            }
        }
    };

    const updateHome = async ({
        HomePda,
        HomeIdx,
        address,
        longtitude,
        latitude,
        location,
        image,
        theme,
        price,
    }) => {
        // console.log(homePda);
        if (program && publicKey) {
            try {
                setLoading(true);
                setTransactionPending(true);
                const [profilePda] = findProgramAddressSync(
                    [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                    program.programId
                );
                console.log(
                    HomeIdx,
                        address,
                        longtitude,
                        latitude,
                        location,
                        image,
                        theme,
                        price
                );
                await program.methods
                    .updateHome(
                        HomeIdx,
                        address,
                        longtitude,
                        latitude,
                        location,
                        image,
                        theme,
                        price,
                    )
                    .accounts({
                        userProfile: profilePda,
                        userAccount: HomePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                toast.success("Successfully EDIT HOME.");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };

    const editListing = ({
        publicKey,
        homeIdx,
        address,
        longtitude,
        latitude,
        location,
        image,
        theme,
        price,
    }) => {
        console.log(
            publicKey,
            homeIdx,
            address,
            longtitude,
            latitude,
            location,
            image,
            theme,
            price,
            "YAY"
        );
    };

    const removeHome = async (homePda, homeIdx) => {
        if (program && publicKey) {
            try {
                setTransactionPending(true);
                setLoading(true);
                const [profilePda, profileBump] = findProgramAddressSync(
                    [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                    program.programId
                );
                console.log(
                    homePda.toString(),
                    homeIdx,
                    publicKey.toString(),
                    profilePda.toString()
                );
                await program.methods
                    .removeHome(homeIdx)
                    .accounts({
                        userProfile: profilePda,
                        userAccount: homePda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                toast.success("Deleted listing");
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };

    const bookHome = async ({ address,
        longtitude,
        latitude,
        location,
        image,
        theme,
        price, }, date) => {
        console.log(address, longtitude, latitude, location, image, theme, price, "BETTT");

        const id = lastBookId + 1;
        if (program && publicKey) {
            try {
                setLoading(true);
                setTransactionPending(true);
                const [profilePda] = findProgramAddressSync(
                    [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                    program.programId
                );
                const [bookPda] = findProgramAddressSync(
                    [utf8.encode("BOOK_STATE"), publicKey.toBuffer()],
                    program.programId
                );
                console.log(profilePda);
                await program.methods
                    .bookHome(id,
                        date,
                        address,
                        longtitude,
                        latitude,
                        location,
                        image,
                        theme,
                        price,)
                    .accounts({
                        userProfile: profilePda,
                        bookingAccount: bookPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                toast.success("SUCCESSFULLY BOOOOOKED");
                setLastBookId(id);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };

    const cancelBooking = async (bookingPda, idx) => {
        console.log("RUNNING");
        if (program && publicKey) {
            try {
                setLoading(true);
                setTransactionPending(true);
                const [profilePda] = findProgramAddressSync(
                    [utf8.encode("USER_STATE"), publicKey.toBuffer()],
                    program.programId
                );
                await program.methods
                    .cancelBooking(idx)
                    .accounts({
                        userProfile: profilePda,
                        bookingAccount: bookingPda,
                        authority: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                toast.success("Canceled Booking");
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setTransactionPending(false);
            }
        }
    };

    // const removeListing = (listingID) => {
    //     setListings(listings.filter((listing) => listing.id !== listingID))
    // }

    // const addListing = ({ location, country, price, description, imageURL }) => {
    //     const id = listings.length + 1

    //     setListings([
    //         ...listings,
    //         {
    //             id,
    //             location: {
    //                 name: location,
    //                 country: country,
    //             },
    //             description,
    //             distance: {
    //                 km: 0,
    //             },
    //             price: {
    //                 perNight: price,
    //             },
    //             rating: 5,
    //             imageURL,
    //         },
    //     ])
    // }

    return {
        homes,
        bookings,
        addHome,
        updateHome,
        removeHome,
        bookHome,
        cancelBooking,
        initializeUser,
        initialized,
        loading,
        transactionPending,
    };
}
