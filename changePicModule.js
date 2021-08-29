async function changePic() {

    
    async function getPicUrl() {
        const jsonDataNiki = await getPlayerInfo(URL);
        console.log(jsonDataNiki);
        picUrl = jsonDataNiki.profile.avatarfull;
        return picUrl;
    };


    async function ChangeSrc() {
        picUrl = await getPicUrl();
        document.getElementById("avatar").src = picUrl;

    }

    ChangeSrc()

}
export default changePic;