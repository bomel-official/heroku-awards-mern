import React, {useContext, useEffect, useState} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {SmallAwardsList} from "../components/SmallAwardsList";
import {useHttp} from "../hooks/http.hook";
import {Message} from "../components/Message";
import {AuthContext} from "../context/AuthContext";

export const AddAwardPage = () => {
    const {token, userId} = useContext(AuthContext)
    const history = useHistory()
    const [filename, setFilename] = useState('')
    const {loading, request, error, clearError} = useHttp()
    const [messageOptions, setMessageOptions] = useState({
        status: '', text: ''
    })
    const [form, setForm] = useState({
        contestName: '', contestDate: '', contestCity: '', contestPlace: '', image: ''
    })

    const formData = new FormData()

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])

    const changeHandler = event => {
        if (event.target.name === 'image') {
            setForm({ ...form, image: event.target.files[0]})
            setFilename(event.target.files[0].name)
        } else {
            setForm({ ...form, [event.target.name]: event.target.value})
        }
    }

    const submitHandler = async event => {
        event.preventDefault()
        clearError()
        try {
            for (let key in form) {
                if (form.hasOwnProperty(key)) {
                    formData.set(key, form[key])
                }
            } // add data to formData from form state

            const data = await request(
                '/api/award/create',
                'POST',
                formData,
                {Authorization: `Bearer ${token}`},
                false
            )
            history.push(`/award/${data.awardId}`)
        } catch (e) {}
    }

    return (
        <main className="my-account-content">
            <div className="my-acoount-form">
                <div className="container">
                    <nav className="my-cabinet-nav">
                        <ul className="my-cabinet-menu-list">
                            <li className="menu-item"><NavLink
                                to="/account">??????????????</NavLink></li>
                            <li className="menu-item current-menu-item"><NavLink
                                to="/add-award">????????????????
                                ??????????????</NavLink></li>
                        </ul>
                    </nav>
                    <div className="bg-outer">
                        <div className="center-container">
                            <Message options={messageOptions} />
                            <form onSubmit={submitHandler}>
                                <div className="field">
                                    <label htmlFor="post_title">?????????????? ????????????????</label>
                                    <input id="post_title"
                                           required={true}
                                           disabled={loading}
                                           type="text"
                                           name="contestName"
                                           placeholder="???? 200 ????????????????"
                                           onChange={changeHandler}
                                           size="40"/>
                                </div>

                                <div className="field">
                                    <label htmlFor="post_image">?????????????????????? ??????????????/??????????????</label>
                                    <br/>
                                    <label htmlFor="post_image" className="file-uploader-label"><span className="file-button">{filename ? "????????????????" : "????????????????"} ??????????????????????</span> {filename}</label>
                                    <br/>
                                    <input type="file"
                                           name="image"
                                           required={true}
                                           disabled={loading}
                                           id="post_image"
                                           onChange={changeHandler}
                                           accept="image/jpeg,.jpg,.jpeg,image/gif,.gif,image/png,.png,image/bmp,.bmp"/>
                                </div>

                                <div className="field">
                                    <label htmlFor="date">???????? ???????????????????? ????????????????</label>
                                    <input type="date"
                                           id="date"
                                           required={true}
                                           disabled={loading}
                                           name="contestDate"
                                           placeholder="dd/mm/yy"
                                           onChange={changeHandler}
                                           size="30"/>
                                </div>

                                <div className="field">
                                    <label htmlFor="city">?????????? ????????????????????</label>
                                    <input id="city" type="text"
                                           data-required="yes"
                                           required={true}
                                           disabled={loading}
                                           datatype="text"
                                           name="contestCity"
                                           onChange={changeHandler}
                                           placeholder=""/>
                                    <span>????????????????: ??????????????????????????</span>
                                </div>

                                <div className="field">
                                    <label htmlFor="place">??????????/??????????????</label>
                                    <select id="place"
                                            name="contestPlace"
                                            required={true}
                                            disabled={loading}
                                            onChange={changeHandler}
                                            datatype="select">
                                        <option value="-1">- ?????????????? -</option>
                                        <option value="1 ??????????">1 ??????????</option>
                                        <option value="2 ??????????">2 ??????????</option>
                                        <option value="3 ??????????">3 ??????????</option>
                                        <option value="1 ??????????????">1 ??????????????</option>
                                        <option value="2 ??????????????">2 ??????????????</option>
                                        <option value="3 ??????????????">3 ??????????????</option>
                                        <option value="?????????????? ???? ??????????????">?????????????? ???? ??????????????</option>
                                    </select>
                                </div>

                                <input type="submit"
                                       name="submit" value="??????????????????"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-account-awards">
                <div className="my-account-awards-list-block">
                    <div className="container">
                        <h2 className="section-heading">?????????????????? ?????????????????????? ??????????????</h2>
                        <SmallAwardsList
                            options={{ userId }}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
