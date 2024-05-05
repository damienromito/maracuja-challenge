import React, { Fragment, useEffect, useState, useRef } from 'react'
import ROUTES from '../../constants/routes'
import { styled, color } from '../../styles'
import { NavBar, Container } from '../../components'

// Convert gdoc to HTML  http://iainbroome.com/how-to-convert-a-google-doc-to-markdown-or-html/

const PageContainer = styled(Container)`
  h1 {margin-bottom : 20px}
  h2 {margin: 20px 0 10px 0 }
  h3 {margin: 10px 0 5px 0 }
  p {margin : 10px 0 }
`

const CGU = ({ history }) => {
  return (
    <>
      <NavBar leftIcon='back' leftAction={() => history.goBack()} title={'Conditions générales d\'utilisation'} />
      <PageContainer>

        <h2>1.OBJET</h2>

        <p>
          Les présentes Conditions Générales d’Utilisation (CGU) ont été mises à jour le 1er Janvier 2020
        </p>
        <p>
          Elles ont pour objet de définir les modalités et conditions dans lesquelles la société MARACUJA  met son Site à disposition des Utilisateurs, ainsi que les modalités et conditions dans lesquelles le Site doit être utilisé par les Utilisateurs.
        </p>
        <p>
          L’accès au Site est subordonné à l’acceptation et au respect des présentes CGU. Tout Utilisateur souhaitant y accéder doit avoir préalablement pris connaissance de ces CGU, les avoir expressément acceptées et s’engage à les respecter sans réserve.
        </p>
        <p>
          Dans le cas où un Utilisateur ne souhaiterait pas accepter tout ou partie des présentes CGU, il lui est demandé de renoncer à tout usage du Site.
        </p>
        <h2>2.DÉFINITIONS</h2>

        <p>
          Site : le site «challenge.maracuja.ac »
        </p>
        <p>
          Utilisateur : toute personne, y compris un Membre, naviguant sur le Site ;
        </p>
        <p>
          Membre : tout Utilisateur authentifié sur le Site via un identifiant, une adresse e-mail et un mot de passe ;
        </p>
        <p>
          Contenu : l’ensemble des informations (vidéos, textes, photographies, commentaires, …) présentes sur le Site.
        </p>
        <p>
          Club : centre équestre, club d'équitation où s'enseigne et se pratique l'équitation à destination du grand public et pour lequel l’Utilisateur ou le Membre est licencié, supporter ou sympathisant.
        </p>
        <p>
          <strong>3.DESCRIPTION GÉNÉRALE DU SITE</strong>
        </p>
        <p>
          La société MARACUJA propose, des Challenges inter-clubs pédagogiques sur la base de questions et/ou quizz avec remise de prix.
        </p>
        <p>
          Le site est ouvert à tous les licenciés, supporters et sympathisants des Clubs affiliés à la Fédération Française d’Equitation.
        </p>
        <p>
          Les challenges sont réalisés en partenariat avec des partenaires (Organisateurs d’événements équestre, centre équestre) avec pour finalité, la possibilité pour les clubs gagnants de gagner des lots fournis par ces partenaires.
          Dans le cadre de ces partenariats, certains challenges sont “réservés” à des clubs, en fonction de leur localisation géographique.
        </p>

        <h2>4.ACCES AU SITE</h2>

        <h3>4.1    Modalités d’accès</h3>

        <p>
          Le Site ainsi que les services qu’il propose sont accessibles gratuitement à tout Utilisateur disposant d’un accès à internet. Tous les coûts afférents à l’accès au Site et à ses services, que ce soient les frais matériels, logiciels ou d’accès à internet sont exclusivement à la charge de l’Utilisateur. Ce dernier est seul responsable du bon fonctionnement de son équipement informatique ainsi que de son accès à internet.
        </p>
        <h3>4.2    Disponibilité du Site</h3>

        <p>
          Préalablement à l’accès au Site, il appartient à tout Utilisateur de vérifier que la configuration informatique qu’il utilise est bien compatible avec la navigation et l’utilisation du Site.
        </p>
        <p>
          Il appartient également à tout Utilisateur de vérifier que la configuration informatique qu’il utilise ne contient aucun virus et qu’elle est en parfait état de fonctionnement.
        </p>
        <p>
          MARACUJA  s’engage à faire ses meilleurs efforts pour assurer à tout Utilisateur une accessibilité au Site 24h/24h, 7j/7j et pendant les phases de Challenge.
        </p>
        <p>
          Néanmoins, MARACUJA se réserve le droit, sans préavis ni indemnité, de fermer temporairement ou définitivement l’accès à tout ou partie du Site (notamment à des fins de maintenance, d’actualisation ou de mise à niveau du Site, ou en raison de problèmes techniques) et ne sera pas tenue responsable des dommages directs ou indirects pouvant en résulter.
        </p>
        <p>
          D’une façon plus générale, MARACUJA ne pourra être tenue responsable en cas d’indisponibilité du Site pour quelque cause que ce soit.
        </p>
        <p>
          MARACUJA se réserve, enfin, la possibilité d’interrompre, de suspendre momentanément ou de modifier sans préavis l’accès à tout ou partie du Site ainsi que, de manière générale, de refuser l’accès au Site, unilatéralement et sans notification préalable, à tout Utilisateur ne respectant pas les présentes CGU, sans que cette interruption ou suspension n’ouvre droit à aucune obligation ni indemnisation.
        </p>
        <h3>4.3    Utilisateur mineur</h3>

        <p>
          Les mineurs sont admis à utiliser le Site et à devenir Membre, à la condition qu’ils aient préalablement obtenu du titulaire (ou des titulaire(s)) de l’autorité parentale les concernant, l’autorisation de le faire et que le(les) titulaire(s) de l’autorité parentale ait (aient) accepté d’être garant(s) du respect par l’Utilisateur mineur des présentes CGU. Toute utilisation du Site par un Utilisateur mineur est effectuée sous l’entière responsabilité du (des) titulaire(s) de l’autorité parentale sur l’utilisateur mineur concerné.
        </p>
        <h2>5.PROPRIETE INTELLECTUELLE</h2>

        <h3>5.1    Droits de propriété intellectuelle de la société MARACUJA</h3>

        <p>
          Le Site ainsi que chacun des éléments qui le composent tels que notamment, sans que cette liste soit exhaustive, le nom de domaine et de sous-domaine, toute marque, logo, logiciel, arborescence, base de données, charte graphique, dessin et modèle, illustration, animation, image, textes sont la propriété exclusive de MARACUJA.
        </p>
        <p>
          En conséquence, toute copie, reproduction, représentation, adaptation, altération, modification, diffusion non autorisée, intégrale ou partielle, extraction ou réutilisation, répétée ou systématique de tout ou partie du Site ou de ses éléments, par quelque moyen et sur quelque support que ce soit, constitue une contrefaçon.
        </p>
        <h2>6.RESPONSABILITE DE MARACUJA</h2>

        <h3>6.1    Responsabilité quant aux informations publiées sur le Site par MARACUJA</h3>

        <p>
          Malgré tous les soins apportés à la création du contenu, MARACUJA ne garantit pas la complétude, la mise à jour, l’exhaustivité, la fiabilité, la véracité, la pertinence ou l’exactitude des informations publiées sur le Site.  Le cas échéant, et sous réserve de notification à MARACUJA d’erreurs ou omissions à l’adresse « bonjour@maracuja.ac », MARACUJA ne peut que s’engager à procéder aux rectifications nécessaires dans les meilleures délais et en considération des contraintes techniques et matérielles.
        </p>
        <p>
          Dans tous les cas, les informations publiées sur le Site n'exonèrent pas les Utilisateurs quels qu’ils soient de procéder par eux-mêmes au contrôle des Contenus et de l’information fournie.
        </p>
        <p>
          Les Utilisateurs sont seuls maîtres de la bonne utilisation, avec discernement et esprit, des informations mises à leur disposition sur le Site.
        </p>
        <p>
          Par conséquent, la responsabilité de MARACUJA ne pourra être recherchée au titre des informations proposées sur le Site pour tout dommage, direct ou indirect et de quelque nature que ce soit.
        </p>
        <h2>7.LIENS HYPERTEXTES</h2>

        <p>
          7.1    Dans l’hypothèse où des liens hypertextes vers des sites Internet tiers, y compris vers des réseaux sociaux, seraient mis à la disposition des Utilisateurs sur le Site, MARACUJA prévient les Utilisateurs qu’elle n’exerce aucune maîtrise éditoriale sur ces sites tiers.
        </p>
        <p>
          Par conséquent, MARACUJA ne peut en aucun cas être tenue responsable des dommages directs ou indirects vis-à-vis de l’Utilisateur résultant de l’accès, du contenu, de l’utilisation ou des dysfonctionnements de ces sites tiers.
        </p>
        <h2>8.DUREE ET RESILIATION</h2>

        <p>
          Le présent contrat est conclu pour une durée indéterminée à compter de l’utilisation du Site par l’Utilisateur.
        </p>
        <p>
          A tout moment, un Membre peut, librement et sans aucun motif, mettre fin à son inscription au Site par simple mail à l’adresse « bonjour@maracuja.ac »
        </p>
        <p>
          De son côté, MARACUJA pourra résilier le compte d’un Membre, sans préavis ni mise en demeure préalable, en cas de manquement de sa part à ses obligations contractuelles au titre des présentes CGU et/ou de violation des lois et règlements en vigueur.
        </p>
        <p>
          Le Membre sera informé de la résiliation de son compte par un courrier électronique ou un sms à son attention comprenant le motif de celle-ci. Cette résiliation interviendra sans préjudice de tous les dommages et intérêts qui pourraient lui être réclamés, ou à ses ayants droit ou représentants légaux, par MARACUJA en réparation du préjudice subi du fait de tels manquements ou violations.
        </p>
        <h2>9.MODIFICATION DES CGU</h2>

        <p>
          Les présentes CGU sont susceptibles d’être modifiées par MARACUJA à tout moment, notamment en cas d’évolutions techniques, légales ou jurisprudentielles ou lors de la mise en place de nouveaux services.
        </p>
        <p>
          Toute modification apportée aux CGU entre en vigueur dès sa mise en ligne. L’Utilisateur se doit donc de consulter la dernière version mise à jour des CGU, accessible en permanence sur le Site, dès lors qu’il accède à ce dernier et, en tout état de cause, avant toute nouvelle navigation et/ou utilisation du Site, afin de prendre connaissance des modifications éventuellement intervenues.
        </p>
        <p>
          L’Utilisateur étant tenu d’accepter les présentes CGU sans réserve, il s’engage à renoncer à accéder, naviguer et utiliser le Site, et à supprimer intégralement son compte du Site dans les plus brefs délais, en cas de désapprobation de ces CGU.
        </p>
        <h2>10.LOI APPLICABLE ET TRIBUNAL COMPETENT</h2>

        <p>
          Les présentes CGU sont soumises au droit français.
        </p>
        <p>
          En cas de litiges ou de réclamations émanant de l’Utilisateur, de MARACUJA ou d’un tiers, relatifs à l’utilisation du Site, seule la version française des présentes CGU aura force obligatoire entre les parties.
        </p>
        <p>
          A défaut de résolution amiable, tout litige susceptible de s’élever entre les parties relatif à l’acceptation, la validité, l’interprétation, l’application ou l’exécution de l’une quelconque des dispositions des présentes CGU sera de la compétence exclusive des juridictions situées dans le ressort de la Cour d’appel de Bordeaux et ce, y compris en cas de référé, de requête ou de pluralité de défendeurs.
        </p>
        <p>
          Des dispositions impératives en vigueur dans les pays dans lesquels MARACUJA propose ses services peuvent néanmoins s’appliquer aux présentes CGU.
        </p>
      </PageContainer>
    </>
  )
}

export default CGU
