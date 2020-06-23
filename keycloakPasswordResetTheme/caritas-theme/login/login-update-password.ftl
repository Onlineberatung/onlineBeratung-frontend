<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "header">
        ${msg("updatePasswordTitle")}
    <#elseif section = "form">
        <form id="kc-passwd-update-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly="readonly" style="display:none;"/>
            <input type="password" id="password" name="password" autocomplete="current-password" style="display:none;"/>

            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcInputWrapperClass!} pw-new">
                    <input type="password" id="password-new" name="password-new" class="${properties.kcInputClass!}" placeholder="${msg("passwordNew")}" autofocus autocomplete="new-password" />
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcInputWrapperClass!} pw-confirm">
                    <input type="password" id="password-confirm" name="password-confirm" class="${properties.kcInputClass!}" placeholder="${msg("passwordConfirm")}" autocomplete="new-password" />
                </div>
            </div>

            <div class="kc-form-info kc-update-info">
                ${msg("updatePasswordInfoText")}
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input id="kc-redirect-button" class="button__item button__primary" type="submit" value="${msg("doPasswordSubmit")}"/>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>