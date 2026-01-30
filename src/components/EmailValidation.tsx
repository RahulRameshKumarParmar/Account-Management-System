import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";

export default function EmailValidation({email}: {email: string}) {

    const [emailIsValid, setEmailIsValid] = useState(false);
    const [emailErrorPopUpMessage, setEmailPopUpErrorMessage] = useState(false);

    useEffect(() => {
        const emailValidations = '@gmail.com';

        if (email.includes(emailValidations)) {
            setEmailIsValid(true);
        }
        else {
            setEmailIsValid(false);
        }
    }, [email])

    return (
        <div>
            {email !== "" ?
                <span
                    onMouseEnter={() => {
                        if (!emailIsValid) {
                            setEmailPopUpErrorMessage(true)
                        }
                    }}
                    onMouseLeave={() => {
                        setEmailPopUpErrorMessage(false);
                    }} className="absolute right-2 top-10">{emailIsValid ? <TiTick size={20} color="green" /> : <ImCross color="red" size={15} />}</span>
                :
                null
            }

            <span className={` ${emailErrorPopUpMessage ? 'block' : 'hidden'} absolute -top-2 -right-5 bg-white transition w-30 text-xs px-3 py-1.5 border border-red-300 rounded-lg`}>
                Email id is invalid
            </span>
        </div>
    )
}