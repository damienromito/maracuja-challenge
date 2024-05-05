import React, { Fragment, useEffect, useState, useRef } from 'react'
import ROUTES from '../../constants/routes'
import { styled, color } from '../../styles'
import { NavBar, Container } from '../../components'

const PageContainer = styled(Container)`
  h1 {margin-bottom : 20px}
  h2 {margin: 20px 0 10px 0 }
  h3 {margin: 10px 0 5px 0 }
  p {margin : 10px 0 }
`

const Privacy = ({ history }) => {
  return (
    <>
      <NavBar leftIcon='back' leftAction={() => history.goBack()} title='Politique de confidentialité' />
      <PageContainer>
        <p>
          Charte des données à caractère personnel à destination des utilisateurs de MARACUJA (le site et ses déclinaisons www.challenge.maracuja.ac)
        </p>
        <p>
          Mise à jour au 1er Octobre 2019
        </p>
        <h2>TITRE I : LA PROTECTION DE DONNEES PERSONNELLES</h2>

        <p>
          MARACUJA s’engage, dans le cadre de son activité, à accorder le maximum d’attention à la sécurité et à la confidentialité des informations en sa possession et à protéger les données personnelles de ses clients et des sujets avec qui elle entre en contact conformément aux lois et règlements en vigueur, notamment la Loi Informatique et Libertés n°78-17 du 6 Janvier 1978 et le Règlement n°2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données.
        </p>
        <h2>Article 1.          Informations générales</h2>

        <p>
          Dans le cadre de ses relations commerciales, la société MARACUJA collecte et traite des données à caractère personnel. Ces données collectées sont nécessaires pour que la société MARACUJA puisse réaliser ses activités et toujours proposer des solutions qui facilitent l’apprentissage.
        </p>
        <p />
        <h2>Article 2.          Identité du responsable de traitement</h2>

        <p />
        <p>
          Le responsable de traitement des données à caractère personnel qui sont collectées est MARACUJA, société par actions simplifiées immatriculée au registre du commerce et des sociétés de Bordeaux sous le numéro 833 732 910 et dont le siège social est situé à BORDEAUX (33000), représentée par son représentant légal en exercice.
        </p>
        <h2>Article 3.          Type de données collectées</h2>

        <p />
        <p>
          Les données à caractère personnel collectées dans le cadre de l’utilisation du service sont notamment le nom, le prénom, le sexe, la date de naissance, la photo de profil, le club équestre, l’adresse électronique et des informations non sensibles liées à votre terminal (type d’appareil ou de navigateur utilisé, système d’exploitation, adresse IP ou MAC, identifiant publicitaire, langage sélectionné, données de géolocalisation).
        </p>
        <p />
        <h2>Article 4.          Finalités du traitement</h2>

        <p />
        <p>
          Fonctionnement et utilisation du service
        </p>
        <p>
          Les données des utilisateurs sont recueillies par MARACUJA lors de la création du compte de l’utilisateur lorsqu’il remplit le formulaire d’inscription, lors de sa navigation sur le site..
        </p>
        <p>
          Ces données à caractère personnel sont collectées pour les fins suivantes :
        </p>
        <p>
          * la validation, l’avancement et le suivi des points de l’utilisateur et de son club;
        </p>
        <p>
          * adapter le contenu ou l’affichage de nos Services à votre terminal pour améliorer votre navigation et optimiser nos services ;
        </p>
        <p>
          * l’envoi d’informations sur la modification ou l’évolution de nos services ;
        </p>
        <p>
          * l’envoi de propositions commerciales et/ou promotionnelles, émanant uniquement de MARACUJA ;
        </p>
        <p>
          * la gestion de la relation client ;
        </p>
        <p>
          * la gestion de l’exercice de vos droits sur vos données personnelles, dans les conditions prévues à l’article 9 ;
        </p>
        <p>
          * la mise à disposition d’outils de partage sur les réseaux sociaux ;
        </p>
        <p>
          * la collecte d’informations statistiques sur l’utilisation du service par les utilisateurs ;
        </p>
        <p>
          * l’envoi d’enquêtes de satisfaction et analyses statistiques.
        </p>
        <h2>Article 5.          Lieu du traitement des données</h2>

        <p />
        <p>
          Le traitement des données collectées par MARACUJA a lieu dans l’Union européenne.
        </p>
        <p />
        <h2>Article 6.          Destinataires des données</h2>

        <p />
        <p>
          Les données nécessaires au bon fonctionnement et à l’utilisation du service seront communiquées aux personnes habilitées au sein de MARACUJA (service après-vente, marketing et développement informatique) conformément aux finalités énoncées ci-dessus (Article 4 : finalités du traitement). Certaines des données personnelles collectées par MARACUJA pourront également être transmises à des sous-traitants et partenaires afin d’assister MARACUJA dans la réalisation de ses activités.
        </p>
        <p />
        <h2>Article 7.          Durée de conservation des données</h2>

        <p />
        <p>
          La durée de conservation de vos Données personnelles varie en fonction de la finalité de la collecte.
        </p>
        <p>
          Les données à caractère personnel recueillies à des fins de bon fonctionnement et utilisation du service sont conservées tant que l’utilisateur dispose d’un compte.
        </p>
        <p>
          Les données à caractère personnel recueillies à des fins de personnalisation des publicités et de marketing ciblé sont conservées pour une durée maximale de 36 mois.
        </p>
        <p />
        <h2>Article 8.          Sécurisation des données</h2>

        <p />
        <p>
          MARACUJA assure la confidentialité, l’intégrité et la sécurité des données qui lui sont confiées en mettant en œuvre les mesures organisationnelles et techniques appropriées, ainsi qu’une protection informatique renforcée.
        </p>
        <p />
        <p>
          Les sous-traitants auxquels fait appel MARACUJA s’engagent également à assurer un haut niveau de protection des données.
        </p>
        <p />
        <h2>Article 9.        Exercice des droits des personnes concernées</h2>

        <p />
        <p>
          L’utilisateur auquel se réfèrent les données personnelles bénéficie à tout moment d’un droit d’accès, de rectification et de suppression ainsi qu’une portabilité de ses données à caractère personnel faisant l’objet du présent traitement. L’utilisateur a également la possibilité de s’opposer à ce dernier ou d’en demander une limitation. Les demandes de mise en œuvre de ces droits devront être transmises à la société MARACUJA à l’adresse email <a href='mailto:bonjour@maracuja.ac'>bonjour@maracuja.ac</a> en précisant “PRICAVY” dans l’objet du mail, accompagnées d’un justificatif d’identité.
        </p>
        <p />
        <p>
          L’utilisateur a également le droit d’obtenir du responsable du traitement la confirmation que des données à caractère personnel le concernant sont ou ne sont pas traitées et, lorsqu’elles le sont, l’accès auxdites données à caractère personnel ainsi que les informations suivantes :
        </p>
        <p>
          – les finalités du traitement ;
        </p>
        <p>
          – les catégories de données à caractère personnel concernées ;
        </p>
        <p>
          – les destinataires ou catégories de destinataires auxquels les données à caractère personnel ont été ou seront communiquées, en particulier les destinataires qui seraient établis dans des pays tiers ;
        </p>
        <p>
          – lorsque cela est possible, la durée de conservation des données à caractère personnel envisagée ou, lorsque ce n’est pas possible, les critères utilisés pour déterminer cette durée;
        </p>
        <p>
          – le droit d’introduire une réclamation auprès d’une autorité de contrôle.
        </p>
        <p />
        <p>
          En cas d’exercice des droits ci-dessus auprès de MARACUJA, la société MARACUJA fournit une copie des données à caractère personnel faisant l’objet d’un traitement et peut exiger le paiement de frais raisonnables basés sur les coûts administratifs pour toute copie supplémentaire demandée par l’intéressé.
        </p>
        <p />
        <h2>Article 10.        Réclamation auprès de la CNIL</h2>

        <p />
        <p>
          L’intéressé peut également introduire une réclamation auprès de la Commission Nationale de l’Informatique et des Libertés dont le siège social est situé au 3 Place de Fontenoy – TSA 80715 – 75334 PARIS CEDEX 07.  Téléphone : 01 53 73 22 22.
        </p>
        <p />
        <p>
          Il est également possible de déposer une plainte en ligne à l’adresse suivante : https://www.cnil.fr/fr/plaintes.
        </p>
        <p />
        <p />
        <h1>TITRE II : INFORMATIONS GENERALES SUR LES LIENS HYPERTEXTES ET COOKIES</h1>

        <p />
        <p>
          Lorsque vous accédez à la plateforme de MARACUJA, notre système et celui de certains de nos prestataires utilisent des cookies pour identifier les préférences des visiteurs.
        </p>
        <p />
        <p>
          Le terme de cookies est à prendre au sens large et couvre l’ensemble des traceurs déposés et/ou lus lors de la consultation d’un site internet ou d’une application mobile par exemple.
        </p>
        <p />
        <p>
          Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la navigation d’un ordinateur ou d’un périphérique.
        </p>
        <p />
        <p>
          Pour en savoir plus sur les cookies et leur incidence sur vous et votre expérience de navigation, consultez le site de la CNIL : https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser.
        </p>
        <p />
        <p />
        <h3>Utilisation des cookies sur l’application de MARACUJA:</h3>

        <h3>MARACUJA utilise le type de cookies suivants :</h3>

        <p />
        <p>
          Cookies fonctionnels ou de session : ce sont les cookies qui collectent des informations et qui s’assurent que le site et l’application mobile sont chargés correctement lorsque vous y accédez via votre navigateur. Les cookies de session sont automatiquement détruits lorsque l’utilisateur ferme son navigateur.
        </p>
        <p />
        <p>
          Cookies analytiques ou de performance : il s’agit des cookies tiers créés  par Google Analytics qui recueillent des renseignements statistiques sur l’accès au site et qui nous permettent de connaître l’utilisation et les performances de notre site et d’en améliorer le fonctionnement.
        </p>
        <p>
          Cookies publicitaires de tierces parties : Vous avez peut-être découvert Maracuja via une publicité sur les réseaux sociaux. C’est un de nos canaux de croissance les plus efficaces. Les cookies de publicités nous permettent de vous afficher les offres qui sont le plus susceptibles de vous intéresser sur des sites tiers.
        </p>
        <p />
        <p />
        <h3>Recueil du consentement des utilisateurs :</h3>

        <p />
        <p>
          Le recours aux cookies analytiques et fonctionnels est exempt de consentement de la part de l’utilisateur puisqu’il s’agit de cookies strictement nécessaires à la fourniture d’un service expressément demandé par l’utilisateur.
        </p>
        <p />
        <p>
          En revanche, l’utilisation de cookies publicitaires de tierces parties ainsi que les cookies de partage sur les réseaux sociaux nécessitent le consentement préalable de l’utilisateur. Un bandeau d’information vous informe de l’utilisation de ces cookies à votre arrivée sur la page d’accueil de notre site Internet et application mobile.
        </p>
        <p />
        <p>
          Le refus de ces cookies tiers n’a pas d’impact sur l’utilisation de notre site. Cependant le fait de les refuser n’entraînera pas l’arrêt de la publicité sur notre site ou sur Internet. Cela aura seulement pour effet d’afficher une publicité qui ne tiendra pas compte de vos centres d’intérêt ou de vos préférences.
        </p>
        <p />
        <p />
        <h3>Durée de conservation des cookies :</h3>

        <p />
        <p>
          La durée de conservation des cookies par MARACUJA dépend du type de cookies :
        </p>
        <p>
          – les cookies de session sont automatiquement détruits lorsque l’utilisateur ferme son navigateur ;
        </p>
        <p>
          – les cookies d’analyses sont eux conservés 13 mois.
        </p>
        <p>
          – les cookies de tierces-parties et de partage sur les réseaux sociaux sont conservés 13 mois à compter du moment où le consentement a été recueilli.
        </p>
        <p />
        <p />
        <h3>Désactiver les cookies :</h3>

        <p />
        <p>
          Vous pouvez configurer votre navigateur pour accepter ou rejeter tous les cookies ou tous types de cookies (tels que les cookies tiers) ou vous pouvez choisir d’être averti à chaque fois qu’un cookie est placé sur votre ordinateur. Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services.
        </p>
        <p />
        <p>
          Vous trouverez ci-dessous le lien à suivre, par navigateur, pour avoir les instructions vous permettant de configurer l’utilisation des cookies:
        </p>
        <p>
          – Microsoft Internet Explorer : https://support.microsoft.com/fr-fr/help/17442/windows-internet-explorer-delete-manage-cookies ;
        </p>
        <p>
          – Mozilla Firefox : https://support.mozilla.org/fr/kb/desactiver-cookies-tiers ;
        </p>
        <p>
          – Google Chrome : https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=fr ;
        </p>
        <p>
          – Apple Safari: https://support.apple.com/fr-fr/guide/safari/sfri11471/mac
        </p>
      </PageContainer>
    </>
  )
}

export default Privacy
