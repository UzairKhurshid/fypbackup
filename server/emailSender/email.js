const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeMail = (email, name) => {
    console.log('sending welcome email')
    sgMail.send({
        to: email,
        from: 'sardar.uzair12@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. You will get an Account Activation email soon.`
    })
}

const sendActivationMail = (email, name) => {
    console.log('sending Activation Mail')
    sgMail.send({
        to: email,
        from: 'sardar.uzair12@gmail.com',
        subject: 'Account Activated',
        text: `Congratualtion, ${name}. Your Account is Active Now.`
    })
}

const sendDeActivationMail = (email, name) => {
    console.log('sending DeActivation Mail')
    sgMail.send({
        to: email,
        from: 'sardar.uzair12@gmail.com',
        subject: 'Account DeActivated',
        text: `Sorry , ${name}. Your Account is Disable Now.`
    })
}

const sendProjectAcceptanceMail = (email) => {
    console.log('sending Acceptance Mail')
    sgMail.send({
        to: email,
        from: 'sardar.uzair12@gmail.com',
        subject: 'Project Accepted',
        text: `Congratualtion Your Request is Accepted Go and check Your Project.`
    })
}

const sendProjectRequestMail = (email) => {
    console.log('sending Request Mail')
    sgMail.send({
        to: email,
        from: 'sardar.uzair12@gmail.com',
        subject: 'Account Acctivated',
        text: `Congratualtion Your Request To the Project is sent Successfully.`
    })
}



module.exports = {
    sendWelcomeMail,
    sendActivationMail,
    sendDeActivationMail,
    sendProjectAcceptanceMail,
    sendProjectRequestMail
}