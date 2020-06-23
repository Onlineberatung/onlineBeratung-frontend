<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
        ${messageHeader}
        <#else>
        ${kcSanitize(msg("accountUpdatedMessage"))?no_esc}
        </#if>
    <#elseif section = "form">
    <div id="kc-info-message">
        <p class="instruction"><#if requiredActions??><#list requiredActions>: <b><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#items></b></#list><#else></#if></p>
        <#if skipLink??>
        <#else>
            <#if pageRedirectUri??>
                <p><a href="${pageRedirectUri}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
            <#elseif actionUri??>
                <p><a href="${actionUri}">${kcSanitize(msg("proceedWithAction"))?no_esc}</a></p>
            </#if>
        </#if>
        <p class="centerText"><a class="textlink" href="/login.html">${kcSanitize(msg("backToLogin"))?no_esc}</a></p>
    </div>
    </#if>
</@layout.registrationLayout>