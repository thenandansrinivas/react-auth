import argon from 'argon2'

const hashPass = async password => {
	return await argon.hash(password)
}

const verifyPass = async (hash, password) => {
	return await argon.verify(hash, password)
}

export { hashPass, verifyPass }
