<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "header">
        ${msg("emailForgotTitle")}
    <#elseif section = "form">
        <div class="kc-form-info">
            ${msg("emailInstruction")}
        </div>

        <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="username" name="username" class="${properties.kcInputClass!}" placeholder="${msg("usernameOrEmail")}" autofocus/>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input id="kc-redirect-button" class="button__item button__primary" type="submit" value="${msg("doSubmit")}"/>
                </div>

                <div id="kc-form-options" class="${properties.kcFormOptionsClass!} kc-form-optionsClass">
                    <a class="textlink" href="/login.html">${kcSanitize(msg("backToLogin"))?no_esc}</a>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>